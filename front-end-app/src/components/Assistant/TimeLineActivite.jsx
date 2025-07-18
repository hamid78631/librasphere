import { useEffect, useState, useRef } from "react";
import { CalendarDays, RotateCcw, AlertTriangle, Info } from 'lucide-react';
import axios from 'axios'
import { motion, AnimatePresence } from "framer-motion";
import '../../styles/assistant/TimelineActivite.css';
import {Toaster , toast } from 'react-hot-toast'
function TimeLineActivite() {
  const [activites, setActivites] = useState([]);
  const [afficher, setAfficher] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/activites')
    .then( res => {
      setActivites( res.data)
      toast.success('Activité généré avec succès!')
      console.log("Réponse API Activités:", res.data);

    }).catch(err => {
      toast.error('Erreur lors du chargement des activités!')
      console.log('erreur' , err)
    })
  }, []);

  const renderIcon = (type) => {
    switch (type) {
      case 'emprunt': return <CalendarDays size={22} color="#4f46e5"/>;
      case 'retour': return <RotateCcw size={22} color="#4f46e5" />;
      case 'retard': return <AlertTriangle size={22} color="#dc2626"/>;
      default: return <Info size={22} />;
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="timeline-horizontal-container">
      <Toaster position="top-right" reverseOrder={false} />
      <button className="btn-toggle-timeline" onClick={() => setAfficher(prev => !prev)}>
        {afficher ? 'Masquer les activités' : 'Afficher les activités'}
      </button>

      <AnimatePresence>
        {afficher && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="timeline-scroll-controls">
              <button onClick={scrollLeft} className="timeline-scroll-btn">←</button>
              <button onClick={scrollRight} className="timeline-scroll-btn">→</button>
            </div>

            <div className="timeline-horizontal-wrapper" ref={scrollRef}>
              {activites.length === 0 ? (
                  <p className='timeline-empty'>Aucune activité récente</p>
              ) : (activites.map((act) => (
                <motion.div
                  key={act.id}
                  className={`timeline-pill timeline-${act.type}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="timeline-pill-icon">{renderIcon(act.type)}</span>
                  <div className="timeline-pill-content">
                    <p className="timeline-pill-date">{act.date}</p>
                    <p className="timeline-pill-text">
                      {act.utilisateur}
                      {act.type === 'emprunt' && ` a emprunté "${act.livre}"`}
                      {act.type === 'retour' && ` a retourné "${act.livre}"`}
                      {act.type === 'retard' && ` est en retard pour "${act.livre}" (${act.joursRetard} jours)`}
                    </p>
                  </div>
                </motion.div>
              ))) 
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TimeLineActivite;
