import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import PageBackground from "../../components/Assistant/Penalites/PageBackground";
import '../../styles/Visiteur/InscriptionVisiteur.css';

function ConnexionVisiteur() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/login', formData, {
        headers: { Accept: "application/json" },
        withCredentials: true
      });

      console.log("✅ Données reçues :", res.data);

      if (!res.data.user || !res.data.token) {
        toast.error("Réponse du serveur invalide.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success('Connexion réussie !');
      
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

    } catch (err) {
      if (err?.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((msg) => toast.error(msg[0]));
      }  else if (err?.response?.status === 403){
        toast.error(err.response.data.message)
      }else if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Une erreur est survenue');
        console.error("❌ Erreur inconnue :", err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inscription-page"
    >
      <PageBackground />
      <form onSubmit={handleSubmit} className="inscription-form">
        <h2 className="inscription-title">Connexion</h2>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
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
        <button type="submit">Se connecter</button>
        <p className="inscription-link">
          Vous n'êtes pas inscrit ? <a href="/inscription">Inscrivez-vous ici</a>
        </p>
      </form>
      <Toaster position="top-right" />
    </motion.div>
  );
}

export default ConnexionVisiteur;
