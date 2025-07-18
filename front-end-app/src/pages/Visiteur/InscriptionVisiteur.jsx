import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import '../../styles/Visiteur/InscriptionVisiteur.css';
import {motion} from 'framer-motion'
import PageBackground from "../../components/Assistant/Penalites/PageBackground";

function InscriptionVisiteur() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    numero_identite: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8000/api/register', formData, {
      headers: {
        Accept: "application/json"
      },
      withCredentials: true
    })
    .then((res) => {
      toast.success('Inscription réussie !');
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));


      switch(res.data.user.role){
        case'admin' :
          navigate('/admin/utilisateurs')
          break 
        case 'assistant' : 
        navigate('/assistant/dashboard')
        break
        case 'adherent' : 
        navigate('/visiteur/accueil')
        break
        default : 
        navigate('/visiteur/accueil')
      }

    })
    .catch((err) => {
      console.error("Erreur lors de l'inscription :", err);
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((msg) =>
          toast.error(msg[0])
        );
      }
      else {
        toast.error("Une erreur est survenue");
      }
    });
  };

  return (
    <motion.div 
    initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inscription-page">
        <PageBackground />
      <form onSubmit={handleSubmit} className="inscription-form">
        
        <h2 className="inscription-title">Inscription</h2>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom complet"
          required
        />
        <input
          type="text"
          name="numero_identite"
          value={formData.numero_identite}
          onChange={handleChange}
          placeholder="Numéro d'identité"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Adresse email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mot de passe"
          required
        />
        <input
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          placeholder="Confirmer le mot de passe"
          required
        />
        <button type="submit">S'inscrire</button>
        <p className="inscription-link">
        Déjà inscrit ? <a href="/connexion">Connectez-vous ici</a>
        </p>
      </form>
      

      <Toaster position="top-right" />
    </motion.div>
  );
}

export default InscriptionVisiteur;
