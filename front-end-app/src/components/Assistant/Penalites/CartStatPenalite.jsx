import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../../../styles/Assistant/Penalite/CartStatPenalite.css';

function CartStatPenalite() {
  const [penalitesLevees, setPenalitesLevees] = useState([]);
  const [penalitesActives, setPenalitesActives] = useState([]);
  const [penalitesBloquees, setPenalitesBloquees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/penalites')
      .then(res => {
        console.log("📦 Données reçues :", res.data);
        
        const raw = res.data;
        let data = [];

        if (Array.isArray(raw)) {
          data = raw;
        } else if (Array.isArray(raw.data)) {
          data = raw.data;
        } else if (Array.isArray(raw.penalites)) {
          data = raw.penalites;
        } else {
          console.warn("⚠️ Format inattendu de la réponse :", raw);
        }

        const levees = data.filter(p => p.statut?.toLowerCase() === "levee");
        const actives = data.filter(p => p.statut?.toLowerCase() === "active");
        const bloques = data.filter(p => {
          const type = p.type?.toLowerCase();
          const statut = p.statut?.toLowerCase();
          return (type === 'non_retour' || type === 'perte') && statut === 'active';
        });

        setPenalitesLevees(levees);
        setPenalitesActives(actives);
        setPenalitesBloquees(bloques);
      })
      .catch(err => {
        toast.error('Erreur lors de la récupération');
        toast.error(err.response?.data?.message || 'Erreur inconnue');
      });
  }, []);

  return (
    <div className="cart-stat-penalite-container">
      <div className="cart-box cart-box-levee">
        <span>{penalitesLevees.length}</span>
        <p>Pénalités levées</p>
      </div>
      <div className="cart-box cart-box-active">
        <span>{penalitesActives.length}</span>
        <p>Pénalités actives</p>
      </div>
      <div className="cart-box cart-box-bloque">
        <span>{penalitesBloquees.length}</span>
        <p>Utilisateurs bloqués</p>
      </div>
    </div>
  );
}

export default CartStatPenalite;
