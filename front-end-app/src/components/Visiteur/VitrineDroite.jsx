// src/components/Visiteur/VitrineDroite.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/Visiteur/VitrineDroite.css';

export default function VitrineDroite() {
  return (
    <div className="vitrine-droite-container">
      {/* Image principale en haut */}
      <motion.div
        className="vitrine-image-haut"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src="/images/livre.gif" alt="Haut" />
      </motion.div>

      {/* Deux images en bas */}
      <div className="vitrine-images-bas">
        <motion.div
          className="image-cadre"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/images/sonic.jpg" alt="Bas gauche" />
          <div className="image-overlay">Bande dessinée</div>
        </motion.div>
        <motion.div
          className="image-cadre"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/images/victor.png" alt="Bas droite" />
          <div className="image-overlay">Victor Hugo</div>
        </motion.div>
      </div>
    </div>
  );
}
