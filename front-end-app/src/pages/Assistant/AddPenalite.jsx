import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import HALO from 'vanta/src/vanta.halo';
import * as THREE from 'three';
import '../../styles/Admin/Formulaires/FormulaireEmprunt.css';
import { useNavigate } from 'react-router-dom';

function AddPenalite() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [emprunts, setEmprunts] = useState([]);
  const [formData, setFormData] = useState({
    utilisateur_id: null,
    emprunt_id: null,
    type: '',
    description: '',
    date_deblocage: '',
    statut : ''
  });
  const statut = [
    {value : ''}
  ]

  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = React.useRef(null);
  const navigate = useNavigate();

  const penaliteTypes = [
    { value: 'retard', label: 'retard' },
    { value: 'non_retour', label: 'non-retour' },
    { value: 'perte', label: 'perte' }
  ];

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        HALO({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          baseColor: 0x0,
          xOffset: 0.08,
          amplitudeFactor: 3.0,
          size: 1.3,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // Charger les utilisateurs
  useEffect(() => {
    axios.get('http://localhost:8000/api/users')
      .then(res => {
        const data = res.data.users || res.data;
        const formattedUsers = data.map(u => ({
          label: u.nom,
          value: u.id,
        }));
        setUtilisateurs(formattedUsers);
      })
      .catch(err => {
        console.error("Erreur utilisateurs :", err);
        toast.error("Erreur chargement utilisateurs.");
      });
  }, []);

  // Charger les emprunts quand utilisateur sélectionné
  useEffect(() => {
    if (!formData.utilisateur_id) {
      setEmprunts([]); // Vider si aucun utilisateur
      return;
    }

    axios.get('http://localhost:8000/api/emprunts')
      .then(res => {
        const formatted = res.data
          .filter(e => e.utilisateur && e.utilisateur.id === formData.utilisateur_id)
          .map(e => ({
            label: `#${e.id} - ${e.livre?.titre || 'Livre inconnu'}`,
            value: e.id,
          }));
        setEmprunts(formatted);
      })
      .catch(err => {
        console.error("Erreur emprunts :", err);
        toast.error("Erreur chargement emprunts.");
        toast(err.response.data.message)
      });
  }, [formData.utilisateur_id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { utilisateur_id, emprunt_id, type, description, date_deblocage } = formData;

    if (!utilisateur_id || !emprunt_id || !type || !description) {
      toast.error("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    axios.post('http://localhost:8000/api/penalites', formData)
      .then(res => {
        toast.success(res.data.message || "Pénalité ajoutée !");
        setFormData({
          utilisateur_id: null,
          emprunt_id: null,
          type: '',
          description: '',
          date_deblocage: ''
        });
        navigate('/assistant/penalite');
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Erreur lors de l'ajout.");
      });
  };

  return (
    <div ref={vantaRef} className="ajouter-emprunt-background">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="ajouter-emprunt-card"
      >
        <h2 className="ajouter-emprunt-title">Ajouter une pénalité</h2>
        <form onSubmit={handleSubmit} className="ajouter-emprunt-form">
          <div>
            <label className="ajouter-emprunt-label">Adhérent</label>
            <Select
              options={utilisateurs}
              value={utilisateurs.find(u => u.value === formData.utilisateur_id)}
              onChange={(option) => setFormData({ ...formData, utilisateur_id: option?.value, emprunt_id: null })}
              placeholder="Sélectionner un utilisateur"
            />
          </div>
          <div>
            <label className="ajouter-penalite-label">Emprunt concerné</label>
            <Select
              options={emprunts}
              value={emprunts.find(e => e.value === formData.emprunt_id)}
              onChange={(option) => setFormData({ ...formData, emprunt_id: option?.value })}
              placeholder="Sélectionner un emprunt"
              isDisabled={!formData.utilisateur_id}
            />
          </div>
          <div>
            <label className="ajouter-emprunt-label">Type de pénalité</label>
            <Select
              options={penaliteTypes}
              value={penaliteTypes.find(t => t.value === formData.type)}
              onChange={(option) => setFormData({ ...formData, type: option?.value })}
              placeholder="Sélectionner un type"
            />
          </div>
          <div>
            <label className="ajouter-emprunt-label">Description</label>
            <textarea
              name="description"
              placeholder="Saisir la description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            ></textarea>
          </div>
          <div>
            <label className="ajouter-emprunt-label">Date de déblocage (facultatif)</label>
            <input
              type="date"
              value={formData.date_deblocage}
              onChange={(e) => setFormData({ ...formData, date_deblocage: e.target.value })}
            />
          </div>
          <button type="submit" className="ajouter-emprunt-button">
            Valider la pénalité
          </button>
        </form>
      </motion.div>
      <br /><br /><br />
    </div>
  );
}

export default AddPenalite;
