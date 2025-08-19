import { motion } from 'framer-motion'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { TextareaAutosize } from '@mui/material'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import '../../styles/Admin/AuditEmprunt.css'

function AuditEmprunt({ searchItem }) {
  const [emprunts, setEmprunts] = useState([])
  // const [loading, setLoading] = useState(true)
  const [selectedEmprunt, setSelectedEmprunt] = useState(null)
  const navigate = useNavigate()

  const fetchEmprunts = () => {
    // setLoading(true)
    axios.get('http://localhost:8000/api/emprunts')
      .then(res => {
        if (Array.isArray(res.data)) {
          setEmprunts(res.data)
        } else {
          setEmprunts([])
        }

        if (Array.isArray(res.data) && res.data.length === 0) {
          toast.info('Aucun emprunt enregistré pour l\u2019instant.', {
            icon: '📭',
            duration: 5000,
          });
        }
      })
      .catch(err => {
        toast.error('Erreur lors du chargement!')
        console.error('erreur:', err)
      })
      // .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEmprunts()
  }, [])

  const empruntsArray = Array.isArray(emprunts) ? emprunts : []

  const filteredEmprunts = empruntsArray.filter((emprunt) => {
    if (!searchItem) return true;
    const term = searchItem.toLowerCase();
    return (
      emprunt.livre?.titre?.toLowerCase().includes(term) ||
      emprunt.utilisateur?.nom?.toLowerCase().includes(term) ||
      emprunt.date_emprunt?.toLowerCase().includes(term) ||
      emprunt.date_retour_prevue?.toLowerCase().includes(term) ||
      emprunt.date_retour_effective?.toLowerCase().includes(term) ||
      emprunt.statut?.toLowerCase().includes(term)
    );
  });

  const handleChangeStatut = (id, nouveauStatut) => {
    Swal.fire({
      title: 'Confirmer le changement de statut',
      text: `Voulez-vous vraiment passer cet emprunt à ${nouveauStatut} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui , confirmer'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:8000/api/emprunts/${id}/retour`)
          .then(() => {
            fetchEmprunts();
            toast.success('Livre marqué comme retourné avec succès !')
          }).catch(err => {
            console.error('erreur : ', err)
            toast.error('Erreur lors de la modification ')
          })
      }
    })
  }

  const calculerJourRetard = (emprunt) => {
    if (emprunt.date_retour_effective === null &&
      emprunt.date_retour_prevue &&
      new Date(emprunt.date_retour_prevue) < new Date()) {
      const difference = new Date() - new Date(emprunt.date_retour_prevue)
      const jourRetard = Math.floor(difference / (1000 * 60 * 60 * 24))
      return jourRetard
    }
    return null
  }

  return (
    <div className="audit-emprunts-historique-container page-content">
      <Toaster position="top-right" reverseOrder={false} />
      {/* {loading ? (
        <div className="loader-container">
          <div className="loader-orb"></div>
          <div className="loader-text">Chargement des emprunts...</div>
        </div> */}
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="audit-emprunts-historique-card"
        >
          <h1 className="audit-emprunts-historique-title">Historique des emprunts</h1>
          <div className="audit-emprunts-historique-table-wrapper">
            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <button
                className="audit-btn-ajouter-emprunt"
                onClick={() => navigate('/admin/emprunts/ajouter')}
              >
                + Ajouter un emprunt
              </button>
            </div>

            <table className="audit-emprunts-historique-table">
              <thead>
                <tr>
                  <th>Livre</th>
                  <th>Adhérent</th>
                  <th>Date emprunt</th>
                  <th>Date retour prévue</th>
                  <th>Date retour effective</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmprunts.length > 0 ? (
                  filteredEmprunts.map((emprunt) => (
                    <tr key={emprunt.id}>
                      <td>{emprunt.livre?.titre || "–"}</td>
                      <td>{emprunt.utilisateur?.nom || "–"}</td>
                      <td>{emprunt.date_emprunt}</td>
                      <td>{emprunt.date_retour_prevue}</td>
                      <td>{emprunt.date_retour_effective || "Non retourné"}</td>
                      <td>
                        <span className={`audit-statut-badge audit-statut-${emprunt.statut}`}>
                          {emprunt.statut}
                        </span>
                        {emprunt.statut === 'en_retard' && (
                          <div style={{ marginTop: '5px', fontWeight: 'bold', color: '#dc2626' }}>
                            {calculerJourRetard(emprunt)} jours
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="audit-btn-group">
                          {emprunt.statut === 'en_cours' || emprunt.statut === 'en_retard'? (
                            <button
                              className="audit-btn-retourner"
                              onClick={() => handleChangeStatut(emprunt.id, 'retourné')}> Retourner </button>
                          ) : (
                            <span style={{ color: '#16a34a', fontWeight: 'bold' }}>
                              ✔
                            </span>
                          )}
                          <button
                            className='audit-btn-voir'
                            onClick={() => setSelectedEmprunt(emprunt)}>
                            Voir plus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : ((
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '1rem', color: 'gray' }}>
                      Aucun emprunt correspondant...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedEmprunt && (
            <div className="audit-popup-emprunt">
              <motion.div
                className="audit-popup-content"
                initial={{ scale: 0.8, opacity: 0, y: -50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
              >
                <h2>Détails de l’emprunt</h2>
                <p><strong>Livre :</strong> {selectedEmprunt.livre?.titre}</p>
                <p><strong>Adhérent :</strong> {selectedEmprunt.utilisateur?.nom}</p>
                <p><strong>Date d’emprunt :</strong> {selectedEmprunt.date_emprunt}</p>
                <p><strong>Date retour prévue :</strong> {selectedEmprunt.date_retour_prevue}</p>
                <p><strong>Date retour effective :</strong> {selectedEmprunt.date_retour_effective || "Non retourné"}</p>
                <p><strong>Statut :</strong> {selectedEmprunt.statut}</p>
                <button onClick={() => setSelectedEmprunt(null)} className="audit-btn-fermer">Fermer</button>
              </motion.div>
            </div>
          )}
        </motion.div>
      
    </div>
  )
}

export default AuditEmprunt;