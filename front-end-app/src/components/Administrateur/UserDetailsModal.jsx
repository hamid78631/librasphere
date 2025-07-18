import React , {useEffect} from 'react'
import {motion , AnimatePresence} from 'framer-motion'
import '../../styles/Admin/BookDetailsModals.css'


function UserDetailsModal({user , open , onClose}){

    useEffect( () => {
        const handleKeyDown = (e) => {
            if(e.key === 'escape'){
                onClose()
            }
        }
        document.addEventListener('keydown' , handleKeyDown)

        return () => document.removeEventListener('keydown' , handleKeyDown)
    },[onClose])
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
            {user && (
              <div className="modal-content-light">
                <div>
                  <h2 className="modal-book-title-light"> Nom Complet : {user.nom}</h2>
                  <h3 className="modal-book-author-light">Email : {user.email}</h3>
    
                  <p className="modal-book-description-light"> {user.description}</p>
                  <p className="modal-book-info-light"><span>Rôle :</span> {user.role}</p>
                  <p className="modal-book-info-light"><span>Statut :</span> {user.statut}</p>
                  <p className="modal-book-info-light"><span>Date d'inscription :</span> {user.date_inscription}</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
      );
}

export default UserDetailsModal 