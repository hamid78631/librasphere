import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import '../../styles/Assistant/AlertesEmprunts.css';
import ModalEmprunt from './ModalRemarque';
import ZoneRemarque from './ZoneRemarque'


function AlertesEmprunts() {
  //Afficher le formulaire d'ajout des alertes grace aux modales 
  const [isModal , setIsModal] = useState(false)
  const [emprunts , setEmprunts] = useState([])
  //Afficher les remarques (conditionnelles )
  const [showRemarques , setShowRemarques] = useState(false)

  //Recevoir les alertes dans le useState
  const [alertes, setAlertes] = useState({
    a_rendre_demain: [],
    en_retard: [],
  });

  //Rechargement des données avec fetch
    const fetchEmprunt = () => {
      axios.get('http://localhost:8000/api/emprunts')
      .then( res => setEmprunts(res.data))
      .catch(err => console.error('Erreur chargement emprunts :', err));
    }

    //Premier rendu de la page , recharger les données des alertes et gérer les erreurs 
  useEffect(() => {
    axios.get('http://localhost:8000/api/alertes')
      .then(res => {
        setAlertes(res.data);
        toast.success('Alertes chargées avec succès');
        fetchEmprunt()
      })
      .catch(err => {
        toast.error("Erreur lors du chargement");
        console.error('Erreur : ', err);
      });
  }, []);

  //créer la carte d'alerte dynamique pour éviter de se répéter (callback )
  const AlertCart = ({ type, utilisateur, livre, date , empruntId }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={`alert-item ${type === 'retard' ? 'retard' : 'demain'}`}
    >
      <span className="timeline-bullet" />
      <h3 className="alert-title">
        📘 {livre}
        <span className="alert-user"> — emprunté par {utilisateur}</span>
      </h3>
      <p className="alert-info">
        {type === 'retard' ? (
          <span className="alert-retard">⏰ En retard</span>
        ) : (
          <span className="alert-demain">🕒 À rendre demain</span>
        )}
        <span> ({date})</span>
      </p>
      <button className="btn-toggle-remarques" onClick={() => setShowRemarques( prev => !prev)}>
          {showRemarques ? "Masquer les remarques" : "Afficher les remarques"}
      </button>

      {showRemarques && <ZoneRemarque empruntId={empruntId} />}

    </motion.div>
  );

  return (
    <div className="alertes-container">
      <Toaster position="top-right" />
      <div>
        <button onClick={() => setIsModal(true)}
           className="btn-ajouter-remarque">
            + Ajouter une remarque ...
        </button>
      </div>
      <h2 className="section-title flex items-center justify-center gap-2">
        <AlertCircle size={24} color='red'/> Alertes d'emprunt
      </h2>

      <div className="alertes-timeline">
        {/* Alertes à rendre demain */}
        {alertes.a_rendre_demain.length > 0 ? (
          <>
            <h3 className="alert-section-title">🕒 À rendre demain</h3>
            {alertes.a_rendre_demain.map((emprunt) => (
              <AlertCart
                key={emprunt.id}
                type="demain"
                utilisateur={emprunt.utilisateur}
                livre={emprunt.livre}
                date={emprunt.date_retour_prevue}
                empruntId={emprunt.id}
              />
            ))}
          </>
        ) : (
          <span className="alert-empty">Aucun emprunt à rendre demain pour l'instant</span>
        )}

        {/* Alertes en retard */}
        {alertes.en_retard.length > 0 ? (
          <>
            <h3 className="alert-section-title text-red-500">⏰ En retard</h3>
            {alertes.en_retard.map((emprunt) => (
              <AlertCart
                key={emprunt.id}
                type="retard"
                utilisateur={emprunt.utilisateur}
                livre={emprunt.livre}
                date={emprunt.date_retour_prevue}
                empruntId={emprunt.id}
              />
            ))}
          </>
        ) : (
          <span className="alert-empty">Aucun emprunt en retard pour l'instant</span>
        )}

        <ModalEmprunt 
        isOpen={isModal}
        onClose={() =>setIsModal(false)} 
        emprunts={emprunts}/>
      </div>
    </div>
  );
}

export default AlertesEmprunts;
