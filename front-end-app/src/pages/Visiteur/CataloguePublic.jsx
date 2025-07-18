import axios from 'axios'
import { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import Entete from '../../components/Administrateur/Entete'
import NavbarVisiteur from '../../components/Visiteur/NavbarVisiteur'
import '../../styles/Visiteur/CataloguePublic.css'
import book from '../../assets/bookk.png'

function CataloguePublic() {
  const [livres, setLivres] = useState([])
  // const [loading, setLoading] = useState(true)
  const [searchItem, setSearchItem] = useState('')
  const [livreSelectionne ,setLivreSelectionne] = useState(null)
  const connecte = localStorage.getItem('token') && localStorage.getItem('user')

  const handleReservation = (livre , e) => {
    e.stopPropagation()
    const utilisateur = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')

    if(!utilisateur && !token ) {
      toast.error('Vous devez être connecté pour réserver ce livre')
      return 
    }
    
    const userId = utilisateur.id
    const livreId = livre.id
    const today = new Date()
    const dateDebut = today.toISOString().split('T')[0]
    const dateFin = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];


    axios.post('http://localhost:8000/api/reservations' ,{
      user_id : userId , 
      livre_id : livreId, 
      date_debut : dateDebut, 
      date_fin : dateFin,
      statut:'en_attente'
    } , {
      headers : {
        Authorization : `Bearer ${token}`
      }
    })
    .then( (res) => {
      toast.success(res.data.message)
      console.log(res.data)
    })
    .catch( err => {
      
      if(err?.response?.data?.message){
        toast(err.response.data.message)
      }
      if (err.response?.status === 409) {
      toast.error(err.response.data.message || 'Réservation impossible (conflit)');
    } else if (err.response?.status === 404) {
      toast.error('Livre introuvable.');
    } else {
      toast.error('Erreur lors de la réservation');
    }
    console.error('Erreur de réservation:', err);
    })
  }

  useEffect(() => {
    axios.get('http://localhost:8000/api/livres')
      .then((res) => {
        setLivres(res.data)
        toast.success('Livre chargées avec succès')
      })
      .catch((err) => {
        console.error('Erreur :', err)
        toast.error('Erreur du chargement des livres')
        toast.error(err?.response?.data?.errors)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
    const livresFiltres = livres.filter((livre) =>
  livre.titre.toLowerCase().includes(searchItem.toLowerCase()) ||
  livre.auteur.toLowerCase().includes(searchItem.toLowerCase()) ||
  livre.categorie.toLowerCase().includes(searchItem.toLowerCase())
)

  return (
    <div>
      <Entete searchItem={searchItem} setSearchItem={setSearchItem}  />
      <NavbarVisiteur />
      {/* {loading ? (
        <div className="loader-container">
          <div className="loader-orb"></div>
          <div className="loader-text">Chargement en cours...</div>
        </div>
      ) :  */}
      
        <div className="catalogue-container">
          {livresFiltres.map((livre) => (
            <div className="livre-item" key={livre.id} onClick={ () => setLivreSelectionne(livre)}>
              <h3>{livre.titre}</h3>
              <img
                src={ livre.image 
                    ? `http://localhost:8000/storage/${livre.image}`
                    : book
                }
                alt={livre.titre}
              />
              <p><strong>Auteur :</strong> {livre.auteur}</p>
              <p>{livre.description}</p>
              <p><em>Catégorie :</em> {livre.categorie}</p>
              {connecte && (
        <button className="btn-reserver" onClick={(e) => e.stopPropagation()} onClick={(e) => handleReservation(livre,e)}>
          Réserver ce livre
        </button>
      )}

      {!connecte && (
        <p style={{ color: '#888', marginTop: '12px' }}>
          Connectez-vous pour réserver ce livre.
        </p>
      )}
            </div>
          ))}
        </div>
      
      {/* } */}

{livreSelectionne && (
  <div className="modal-overlay" onClick={() => setLivreSelectionne(null)}>
    <div className="modal-livre" onClick={(e) => e.stopPropagation()}>
      <button
        className="modal-close"
        onClick={() => setLivreSelectionne(null)}
        aria-label="Fermer"
      >
        ✖
      </button>
      <img
  src={livreSelectionne.image 
    ? `http://localhost:8000/storage/${livreSelectionne.image}` 
    : book
  }
  alt={livreSelectionne.titre}
/>

      <h2>{livreSelectionne.titre}</h2>
      <p><strong>Auteur :</strong> {livreSelectionne.auteur}</p>
      <p>{livreSelectionne.description}</p>
      <p><em>Catégorie :</em> {livreSelectionne.categorie}</p>
      {connecte && (
        <button className="btn-reserver" onClick={(e) => handleReservation(livreSelectionne , e)}>
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

      <Toaster position='top-right'/>
    </div>
  )
}

export default CataloguePublic
