import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import '../../styles/Visiteur/DernieresSorties.css';
import {toast , Toaster} from 'react-hot-toast'
function DernieresSorties() {
  const scrollRef = useRef(null);
  const [livreSelectionne, setLivreSelectionne] = useState(null);
  const connecte = localStorage.getItem("token") && localStorage.getItem("user")
  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const offset = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -offset : offset,
      behavior: 'smooth',
    });
  };

  const livres = [
    { id: 1, titre: "Le pouvoir du moment présent", image: "/images/S2.png" },
    { id: 2, titre: "L'Énigme de Teneris", image: "/images/Teneris.png" },
    { id: 3, titre: "Le vent se lève", image: "/images/vent.png" },
    { id: 4, titre: "David Copperfield", image: "/images/David.png" },
    { id: 5, titre: "Harry Potter - Les Origines", image: "/images/Haryy.png" },
    { id: 6, titre: "Le chant d'achille - Madeline Miller", image: "/images/ChantAchille.png" },
    { id: 7, titre: "Le serpent majuscule - Pierre Lemaitre", image: "/images/serpentMajuscule.png" },
   { id: 8, titre: "La fabrique des lendemains - Rich Larson", image: "/images/FabriqueLendemain.png" },
      { id: 10, titre: "La bibliothèque de minuit - Matt Haig", image: "/images/Minuit.png" },
      { id: 11, titre: "Projet dernière chance - Andy Weir" , image: "/images/Chance.png" },
  ];
const handleReservation = (livre) => {
  // À adapter selon ton backend ou ta logique
  console.log("Réservation demandée pour :", livre.titre);
  toast.success(`Livre réservé : ${livre.titre}`);
};

  return (
    <section className="section-nouveautes">
      <Toaster position='top-right'/>
      <h2 className="titre-nouveautes">Dernières sorties</h2>

      <div className="chevrons-nouveautes">
        <button className="chevron-btn" onClick={() => handleScroll('left')}>
          <ChevronLeft size={22} />
        </button>
        <button className="chevron-btn" onClick={() => handleScroll('right')}>
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="grid-nouveautes" ref={scrollRef}>
        {livres.map((livre) => (
          <div
            key={livre.id}
            className="carte-livre"
            onClick={() => setLivreSelectionne(livre)}
          >
            <img src={livre.image} alt={livre.titre} className="carte-image" />
            <div className="carte-gradient" />
            <div className="carte-footer">{livre.titre}</div>
          </div>
        ))}
      </div>

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

export default DernieresSorties;


