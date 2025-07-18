import React, { useRef, useState } from "react";
import CarteLivreCoups from "./CarteLivreCoups";
import "../../styles/Visiteur/CoupsDeCoeurs.css";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {toast , Toaster} from 'react-hot-toast'

export default function CoupsDeCoeur() {
  const containerRef = useRef(null);
  const [livreSelectionne, setLivreSelectionne] = useState(null); // 🌟 nouvel état
  const connecte = localStorage.getItem("token") && localStorage.getItem("user")
  /* Scroll latéral ------------------------------------------------------- */
  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };
  const handleReservation = (livre) => {
  // À adapter selon ton backend ou ta logique
  console.log("Réservation demandée pour :", livre.titre);
  toast.success(`Livre réservé : ${livre.titre}`);
};


  /* Données -------------------------------------------------------------- */
  const coups = [
    { titre: "L'Alchimiste", image: "/images/Alchimiste.png", etiquette: "Populaire" },
    { titre: "Le Vent se Lève", image: "/images/vent.png", etiquette: "Gratuit" },
    { titre: "Teneris", image: "/images/Teneris.png", etiquette: "Exclusif" },
    { titre: "Harry Potter", image: "/images/Harrypoter.png", etiquette: "Magie" },
    { titre: "Dragon Quest", image: "/images/Dragon.png", etiquette: "Aventure" },
    { titre: "Viking", image: "/images/viking.png", etiquette: "Histoire" },
    { titre: "1984", image: "/images/1984.png", etiquette: "Classique" },
    { titre: "Problème à trois corps", image: "/images/Enigme.png", etiquette: "Science" },
    { titre: "The Midnight Library", image: "/images/Mytique.png", etiquette: "Fantaisie" },
  ];

  return (
    <section className="section-coup-coeur">
      <Toaster position='top-right' />
      <h2 className="titre-coup-coeur">Nos Coups de Cœur</h2>

      {/* Chevrons --------------------------------------------------------- */}
      <div className="chevrons-container">
        <button onClick={scrollLeft} className="chevron-btn gauche" aria-label="Précédent">
          <ChevronLeft size={26} />
        </button>
        <button onClick={scrollRight} className="chevron-btn droite" aria-label="Suivant">
          <ChevronRight size={26} />
        </button>
      </div>

      {/* Liste horizontale ------------------------------------------------ */}
      <div className="grid-coup-coeur scrollable-coups" ref={containerRef}>
        {coups.map((livre, idx) => (
          <div key={idx} onClick={() => setLivreSelectionne(livre)}>
            <CarteLivreCoups
              titre={livre.titre}
              image={livre.image}
              etiquette={livre.etiquette}
            />
          </div>
        ))}
      </div>

      {/* Modale ----------------------------------------------------------- */}
      {livreSelectionne && (
  <div className="modal-overlay" onClick={() => setLivreSelectionne(null)}>
    <div className="modal-livre" onClick={(e) => e.stopPropagation()}>
      {/* Bouton de fermeture */}
      <button
        className="modal-close"
        onClick={() => setLivreSelectionne(null)}
        aria-label="Fermer"
      >
        <X size={22} />
      </button>

      {/* Contenu du livre */}
      <img src={livreSelectionne.image} alt={livreSelectionne.titre} />
      <h3>{livreSelectionne.titre}</h3>

      {/* Bouton réserver */}
      {connecte && (
        <button className="btn-reserver" onClick={() => handleReservation(livreSelectionne)}>
          Réserver ce livre
        </button>
      )}

      {!connecte && (
        <p style={{ color: '#888', marginTop: '12px' }}>
          Connectez-vous pour réserver ce livre.
        </p>
      )}

    </div>
  </div>
)}

    </section>
  );
}
