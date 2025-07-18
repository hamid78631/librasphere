// src/components/Visiteur/CarteLivreCoups.jsx
import React from 'react';
import '../../styles/Visiteur/CarteLivreCoups.css';

export default function CarteLivreCoups({ titre, image, etiquette }) {
  return (
    <div className="carte-livre">
      <img src={image} alt={titre} className="carte-image" />
      <div className="carte-gradient"></div>
      <div className="carte-footer">
        <p className="carte-titre">{titre}</p>
        <span className="carte-etiquette">{etiquette}</span>
      </div>
    </div>
  );
}
