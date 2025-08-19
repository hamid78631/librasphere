import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import '../../styles/Admin/AuditReservations.css'
import {useNavigate} from 'react-router-dom'

function AuditReservations({ searchItem }) {
  const [reservations, setReservations] = useState([])
  // const [loading, setLoading] = useState(true)


  const navigate = useNavigate()
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/reservations')
      .then((res) => {
        console.log("🛠 Résultat brut de l'API :", res.data)
      const data = res.data?.data || res.data?.reservations || []
      setReservations(data)
      toast.success('Réservations récupérées avec succès!')
      })
      .catch((err) => {
        toast.error('Erreur lors de la récupération des réservations!')
        console.error('Erreur : ', err)
      })
      // .finally(() => setLoading(false))
  }, [])

  const handleClick = (id) => {
    Swal.fire({
      title: 'Es-tu sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/api/reservations/${id}`)
          .then(() => {
            setReservations((prev) => prev.filter((livre) => livre.id !== id))
            toast.success('Réservation supprimée avec succès!')
          })
          .catch((err) => {
            toast.error('Erreur lors de la suppression')
            console.log('Erreur lors de la suppression !', err)
          })
      }
    })
  }

  const filteredReservations = reservations.filter((res) => {
    if (!searchItem) return true
    return Object.values(res).some((val) =>
      val && String(val).toLowerCase().includes(searchItem.toLowerCase())
    )
  })

  return (
    <div className="audit-emprunts-historique-container page-content">
      <Toaster position="top-right" />

      {/* {loading ? (
        <div className="loader-container">
          <div className="loader-orb"></div>
          <div className="loader-text">Chargement en cours...</div>
        </div>
      ) : ( */}
        <motion.div
          className="audit-emprunts-historique-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="audit-emprunts-historique-title">Informations sur les réservations</h1>
          {/* <Link to="/ajouter-reservation" className="btn btn-primary">+ Ajouter une réservation</Link> */}
          <div className="audit-emprunts-historique-table-wrapper">
            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <button
                className="audit-btn-ajouter-emprunt"
                onClick={() => navigate('/admin/reservations/Ajout')}
              >
                + Ajouter une réservation
              </button>
            </div>
            <table className="audit-emprunts-historique-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Titre du livre</th>
                  <th>Statut</th>
                  <th>Date début</th>
                  <th>Date fin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {filteredReservations.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '1rem', color: 'gray' }}>
                      Aucune réservation trouvée
                    </td>
                  </tr>
                </tbody>
        ) : (
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.utilisateur_nom || 'N/A'}</td>
                <td>{reservation.livre_titre || 'N/A'}</td>
                <td>{reservation.statut}</td>
                <td>{reservation.date_debut}</td>
                <td>{reservation.date_fin}</td>
                <td>
                  <Link to={`/admin/reservations/editReservations/${reservation.id}`} className="action-btn modifier-btn">Modifier</Link>
                  <button
                    className="action-btn supprimer-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClick(reservation.id)
                    }}
                  >
                    Supprimer
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
)}

            </table>
          </div>
        </motion.div>
      
    </div>
  )
}

export default AuditReservations