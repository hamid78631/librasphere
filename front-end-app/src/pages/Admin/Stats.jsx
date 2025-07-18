import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "../../styles/Admin/EmpruntGraphique.css";
import Entete from "../../components/Administrateur/Entete";
import ParentHeader from "../../components/Administrateur/ParentHeader";
import axios from "axios";

const AjouterGraphe = () => {
  const refs = {
    bar: useRef(null),      // Emprunts par catégorie
    retard: useRef(null),   // Retards par livre
    visites: useRef(null),  // Visites (simulées ici)
    livre: useRef(null),    // Livres populaires
    jour: useRef(null),     // Emprunts par jour
    semaine: useRef(null),  // Emprunts par semaine
    taux: useRef(null),     // Taux de retard
  };
  const charts = useRef({});

  const [totAdh, setTotAdh] = useState(0);
  const [totLiv, setTotLiv] = useState(0);
  const [totRet, setTotRet] = useState(0);

  // Données pour graphiques
  const [stats, setStats] = useState({
    bar: { labels: [], data: [] },       // Emprunts par catégorie
    retard: { labels: [], data: [] },    // Retards par livre
    visites: { labels: [], data: [] },   // Visites simulées
    livre: { labels: [], data: [] },     // Livres populaires
    jour: { labels: [], data: [] },      // Emprunts par jour
    semaine: { labels: [], data: [] },   // Emprunts par semaine
    taux: { labels: ["Taux de retard"], data: [] }, // Taux de retard (%)
  });

  // Fonction d'export CSV
  const exportCSV = () => {
    const rows = [];
    const pushSection = (title, labels, data) => {
      rows.push([`## ${title}`]);
      rows.push(["Label", ...labels]);
      rows.push(["Valeur", ...data]);
      rows.push([]);
    };

    pushSection("Emprunts par catégorie", stats.bar.labels, stats.bar.data);
    pushSection("Retards", stats.retard.labels, stats.retard.data);
    pushSection("Visites", stats.visites.labels, stats.visites.data);
    pushSection("Populaires", stats.livre.labels, stats.livre.data);
    pushSection("Par jour", stats.jour.labels, stats.jour.data);
    pushSection("Par semaine", stats.semaine.labels, stats.semaine.data);
    pushSection("Taux de retard (%)", stats.taux.labels, stats.taux.data);

    rows.push(["## Totaux"]);
    rows.push(["Adhérents", totAdh]);
    rows.push(["Livres", totLiv]);
    rows.push(["Retards", totRet]);

    const csvContent = "\ufeff" + rows.map(r => r.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "statistiques_emprunts.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to group data by category
  const groupByCategory = (emprunts, livres) => {
    // Map livreId => categorie
    const livreCat = {};
    livres.forEach(l => { livreCat[l.id] = l.categorie || "Inconnu"; });

    const counts = {};
    emprunts.forEach(e => {
      const cat = livreCat[e.livre_id] || "Inconnu";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return {
      labels: Object.keys(counts),
      data: Object.values(counts),
    };
  };

  // Helper pour livres populaires (top 5 par nombre d'emprunts)
  const livresPopulaires = (livres) => {
    // Si livres ont un champ 'emprunts_count' ou similaire
    // Sinon on simule par exemple en prenant premiers 5
    let sorted = [...livres];
    if (livres.length && livres[0].emprunts_count !== undefined) {
      sorted.sort((a,b) => b.emprunts_count - a.emprunts_count);
    }
    else {
      // pas de count, on fait juste les 5 premiers
    }
    sorted = sorted.slice(0,5);
    return {
      labels: sorted.map(l => l.titre || l.nom || `Livre ${l.id}`),
      data: sorted.map(l => l.emprunts_count || Math.floor(Math.random()*50)+10),
    };
  };

  // Helper pour groupe emprunts par jour (format YYYY-MM-DD)
  const empruntsParJour = (emprunts) => {
    const counts = {};
    emprunts.forEach(e => {
      const day = e.date_emprunt ? e.date_emprunt.slice(0,10) : "Inconnu";
      counts[day] = (counts[day] || 0) + 1;
    });
    const labels = Object.keys(counts).sort();
    const data = labels.map(l => counts[l]);
    return { labels, data };
  };

  // Helper pour groupe emprunts par semaine (format ISO semaine)
  const empruntsParSemaine = (emprunts) => {
    const counts = {};
    emprunts.forEach(e => {
      if(!e.date_emprunt) return;
      const date = new Date(e.date_emprunt);
      // Récupérer numéro de semaine ISO
      const onejan = new Date(date.getFullYear(),0,1);
      const week = Math.ceil((((date - onejan) / 86400000) + onejan.getDay()+1)/7);
      const label = `S${week} ${date.getFullYear()}`;
      counts[label] = (counts[label] || 0) + 1;
    });
    const labels = Object.keys(counts).sort();
    const data = labels.map(l => counts[l]);
    return { labels, data };
  };

  // Helper pour retards par livre (depuis pénalités)
  const retardsParLivre = (penalites, livres) => {
    // Filter retards
    const retards = penalites.filter(p => p.type === "retard");
    const counts = {};
    // Map livreId => titre
    const livreTitres = {};
    livres.forEach(l => { livreTitres[l.id] = l.titre || `Livre ${l.id}`; });
    retards.forEach(r => {
      const idLivre = r.livre_id; // adapter selon structure des pénalités
      const titre = livreTitres[idLivre] || "Inconnu";
      counts[titre] = (counts[titre] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const data = labels.map(l => counts[l]);
    return { labels, data };
  };

  // Calcul taux de retard : (nb retards) / (nb emprunts)
  const calculTauxRetard = (penalites, emprunts) => {
    const nbRetards = penalites.filter(p => p.type === "retard").length;
    const nbEmprunts = emprunts.length;
    return nbEmprunts ? [(nbRetards / nbEmprunts * 100).toFixed(2)] : [0];
  };

  // Simuler les visites (car route inconnue)
  const visitesSimulees = () => {
    const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
    const data = labels.map(() => Math.floor(Math.random() * 100) + 20);
    return { labels, data };
  };

  // Chargement et composition des données
  useEffect(() => {
    // On lance toutes les requêtes
    Promise.all([
      axios.get("http://localhost:8000/api/users"),       // adhérents
      axios.get("http://localhost:8000/api/livres"),      // livres
      axios.get("http://localhost:8000/api/penalites"),   // pénalités
      axios.get("http://localhost:8000/api/emprunts"),    // emprunts
    ]).then(([usersRes, livresRes, penalitesRes, empruntsRes]) => {
      const users = usersRes.data || [];
      const livres = livresRes.data || [];
      const penalites = penalitesRes.data || [];
      const emprunts = empruntsRes.data || [];

      // Totaux
      setTotAdh(users.length);
      setTotLiv(livres.length);
      setTotRet(penalites.filter(p => p.type === "retard").length);

      // Emprunts par catégorie
      const bar = groupByCategory(emprunts, livres);

      // Retards par livre
      const retard = retardsParLivre(penalites, livres);

      // Visites simulées
      const visites = visitesSimulees();

      // Livres populaires
      const livre = livresPopulaires(livres);

      // Emprunts par jour
      const jour = empruntsParJour(emprunts);

      // Emprunts par semaine
      const semaine = empruntsParSemaine(emprunts);

      // Taux de retard
      const tauxData = calculTauxRetard(penalites, emprunts);

      setStats({
        bar,
        retard,
        visites,
        livre,
        jour,
        semaine,
        taux: { labels: ["Taux de retard (%)"], data: tauxData },
      });
    }).catch(err => {
      console.error("Erreur chargement stats:", err);
      // En cas d'erreur, on peut définir des valeurs vides ou simuler
      setStats({
        bar: { labels: [], data: [] },
        retard: { labels: [], data: [] },
        visites: visitesSimulees(),
        livre: { labels: [], data: [] },
        jour: { labels: [], data: [] },
        semaine: { labels: [], data: [] },
        taux: { labels: ["Taux de retard (%)"], data: [0] },
      });
    });
  }, []);

  // Construction et affichage des graphiques
  useEffect(() => {
    if (!stats) return;
    Object.values(charts.current).forEach(c => c && c.destroy());

    const make = (key, type, chartData) => {
      const ctx = refs[key].current?.getContext("2d");
      if (!ctx) return;
      charts.current[key] = new Chart(ctx, {
        type,
        data: {
          labels: chartData.labels,
          datasets: [{
            label: key === "taux" ? "Taux (%)" : key === "retard" ? "Retards" : key === "bar" ? "Emprunts" : key === "livre" ? "Populaires" : key,
            data: chartData.data,
            backgroundColor: key === "bar" || key === "livre" ? "#66c2ff"
              : key === "visites" ? "#a3d4fd"
              : key === "retard" ? "rgba(255, 99, 132, 0.5)"
              : key === "taux" ? "rgba(67, 131, 235, 0.6)"
              : "#4383eb",
            borderColor: key === "retard" || key === "taux" ? "#ff6384" : "#4383eb",
            fill: key === "retard" || key === "taux",
            tension: 0.3,
          }],
        },
        options: { responsive: true },
      });
    };

    make("bar", "bar", stats.bar);
    make("retard", "line", stats.retard);
    make("visites", "bar", stats.visites);
    make("livre", "bar", stats.livre);
    make("jour", "line", stats.jour);
    make("semaine", "line", stats.semaine);
    make("taux", "line", stats.taux);

  }, [stats]);

  return (
    <div className="graphique-contenu">
      <Entete />
      <ParentHeader />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "15px" }}>
        <button type="button" onClick={exportCSV} className="bouton-csv">⬇ Exporter CSV</button>
      </div>

      <div className="cadran-contenu">
        <div className="cadran"><p>{totAdh}</p><h4>Adhérents</h4></div>
        <div className="cadran"><p>{totLiv}</p><h4>Livres</h4></div>
        <div className="cadran"><p>{totRet}</p><h4>Retards</h4></div>
      </div>

      <div className="graphe">
        <div className="graphique"><h3 className="titre-graphique">📊 Emprunts par catégorie</h3><canvas ref={refs.bar} /></div>
        <div className="graphique"><h3 className="titre-graphique">⏳ Retards par livre</h3><canvas ref={refs.retard} /></div>
      </div>

      <div className="graphe">
        <div className="graphique"><h3 className="titre-graphique">👥 Visites (simulées)</h3><canvas ref={refs.visites} /></div>
        <div className="graphique"><h3 className="titre-graphique">📚 Livres populaires</h3><canvas ref={refs.livre} /></div>
      </div>

      <div className="graphe">
        <div className="graphique"><h3 className="titre-graphique">📅 Emprunts par jour</h3><canvas ref={refs.jour} /></div>
        <div className="graphique"><h3 className="titre-graphique">📆 Emprunts par semaine</h3><canvas ref={refs.semaine} /></div>
      </div>

      <div className="graphe">
        <div className="graphique"><h3 className="titre-graphique">📉 Taux de retard</h3><canvas ref={refs.taux} /></div>
      </div>
    </div>
  );
};

export default AjouterGraphe;
