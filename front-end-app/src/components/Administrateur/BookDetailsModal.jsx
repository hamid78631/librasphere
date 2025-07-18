import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/Admin/BookDetailsModals.css';

function BookDetailsModal({ book, open, onClose }) {
  // if (!book) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence mode="wait">
  {open && (
    <motion.div
      key="modal"
      className="modal-overlay-light"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        key="modal-card"
        className="modal-card-light"
        initial={{ scale: 0.95, y: -10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="modal-close-btn-light"
          aria-label="Fermer la fenêtre"
        >
          &times;
        </button>

        {/* Afficher seulement si les données sont là */}
        {book && (
          <div className="modal-content-light">
            {book.image && (
              <img
                src={book.image}
                alt={`Couverture de ${book.titre}`}
                className="modal-book-image-light"
              />
            )}
            <div>
              <h2 className="modal-book-title-light">{book.titre}</h2>
              <h3 className="modal-book-author-light">{book.auteur}</h3>

              <div className="modal-rating-light">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={i < Math.floor(book.rating) ? '' : 'empty'}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                ))}
                <span className="modal-rating-score-light">({book.rating})</span>
              </div>

              <p className="modal-book-description-light">{book.description}</p>
              <p className="modal-book-info-light"><span>Catégorie :</span> {book.categorie}</p>
              <p className="modal-book-info-light"><span>Quantité :</span> {book.quantite}</p>
              <p className="modal-book-info-light"><span>Date d'ajout :</span> {book.date_ajout}</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}

export default BookDetailsModal;
