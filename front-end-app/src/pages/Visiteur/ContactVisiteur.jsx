import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {useNavigate} from 'react-router-dom'
import PageBackground from "../../components/Assistant/Penalites/PageBackground";
import "../../styles/Visiteur/ContactVisiteur.css";

/**
 * Composant formulaire de contact pour l'espace visiteur.
 * Utilise le même fond animé (PageBackground) que les autres pages.
 */
export default function ContactVisiteur() {
  const [formData, setFormData] = useState({ nom: "", email: "", message: "" });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const navigate = useNavigate()
    const handleSubmit = async () => {
    // e.preventDefault();
    // try {
    //   await axios.post("http://localhost:8000/api/contact", formData, {
    //     headers: { Accept: "application/json" },
    //     withCredentials: true,
    //   });
    //   toast.success("Message envoyé avec succès 👍");
    //   setFormData({ nom: "", email: "", message: "" });
    // } catch (err) {
    //   toast.error(
    //     err.response?.data?.message || "Une erreur est survenue lors de l'envoi"
    //   );
    //   console.error(err);
    // }

    toast.success('Message envoyé avec succès!')
    navigate('/visiteur/accueil')
  };

  return (
    <>
      {/* Fond animé plein écran */}
      <PageBackground />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="contact-page"
      >
        <form onSubmit={handleSubmit} className="contact-form">
          <h2 className="contact-title">Contactez-nous</h2>

          <input
            type="text"
            name="nom"
            placeholder="Nom complet"
            value={formData.nom}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Votre message..."
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Envoyer</button>
        </form>

        {/* Notifications toasts */}
        <Toaster position="top-right" />
      </motion.div>
    </>
  );
}
