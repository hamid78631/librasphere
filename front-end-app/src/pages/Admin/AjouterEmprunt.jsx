import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import HALO from 'vanta/src/vanta.halo';
import * as THREE from 'three';
import '../../styles/Admin/Formulaires/FormulaireEmprunt.css'
import {useNavigate} from 'react-router-dom'

function AjouterEmprunt() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [livres, setLivres] = useState([]);
  const [formData, setFormData] = useState({ user_id: null, livre_id: null });
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = React.useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        HALO({
          el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      baseColor: 0x0,
      xOffset: 0.08,
      amplitudeFactor: 3.0,
      size:1.3,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/users').then(res => {
      const formattedUsers = res.data.map(user => ({
        label: user.nom,
        value: user.id,
      }));
      setUtilisateurs(formattedUsers);
    });

    axios.get('http://localhost:8000/api/livres').then(res => {
      const formattedLivres = res.data
        .filter(l => l.quantite > 0)
        .map(livre => ({
          label: livre.titre,
          value: livre.id,
        }));
      setLivres(formattedLivres);
    });
  }, []);

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.user_id || !formData.livre_id) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    axios.post('http://localhost:8000/api/emprunts', formData)
      .then(res => {
        toast.success(res.data.message);
        setFormData({ user_id: null, livre_id: null });
        navigate('/admin/emprunts')
      })
      .catch(err => {
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data.message ||'Erreur de validation!');
        } else if(err.response?.status === 400){
          toast.error("Cet utilisateur a deja un emprunt pour ce livre !");
        }else{
          toast.error('Erreur lors de l\'ajout')
          console.error('erreur' , err)
        }
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
        <h2 className="ajouter-emprunt-title">Ajouter un Emprunt</h2>
        <form onSubmit={handleSubmit} className="ajouter-emprunt-form">
          <div>
            <label className="ajouter-emprunt-label">Adhérent</label>
            <Select
              options={utilisateurs}
              value={utilisateurs.find(u => u.value === formData.user_id)}
              onChange={(option) => setFormData({ ...formData, user_id: option?.value })}
              placeholder="Sélectionner un utilisateur"
            />
          </div>
          <div>
            <label className="ajouter-emprunt-label">Livre</label>
            <Select
              options={livres}
              value={livres.find(l => l.value === formData.livre_id)}
              onChange={(option) => setFormData({ ...formData, livre_id: option?.value })}
              placeholder="Sélectionner un livre disponible"
            />
          </div>
          <button type="submit" className="ajouter-emprunt-button">
            Valider l'emprunt
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default AjouterEmprunt;
