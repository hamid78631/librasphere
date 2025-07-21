import { useState, useEffect } from 'react'
import logo from '../../../assets/Logo.png'
import axios from 'axios'
import { toast , Toaster} from 'react-hot-toast'
import '../../../styles/Admin/Formulaires/FormAjoutReservation.css'

function FormAjoutReservations({ reservation, onChange, onSubmit }) {
    const [submitting, setSubmitting] = useState(false)
    const [livres, setLivres] = useState([])
    const [utilisateurs, setUtilisateurs] = useState([])

    const handleLocalSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await onSubmit(e)
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        axios.get('http://localhost:8000/api/livres')
            .then((res) => {
                setLivres(res.data)
            })
            .catch(err => {
                toast.error('Erreur lors du chargement des livres')
                console.error('erreur livres :', err)
            })

        axios.get('http://localhost:8000/api/users')
            .then((res) => {
                setUtilisateurs(res.data)
            })
            .catch(err => {
                toast.error('Erreur lors du chargement des utilisateurs')
                console.error('erreur utilisateurs :', err)
            })
    }, [])

    return (
        <div className="form-container">
            <Toaster position='top-right' />
            <form onSubmit={handleLocalSubmit} className="form-reservation">
                <div className="form-logo-wrapper">
                    <img
                        src={logo}
                        alt="logo Librasphere"
                        style={{
                            width: '150px',
                            height: 'auto',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    />
                    <h1 style={{ textAlign: 'center' }}>Ajouter une réservation</h1>
                </div>

                {/* Sélection utilisateur */}
                <div className="form-group">
                    <label htmlFor="user_id">Adhérent :</label>
                    <select
                        id="user_id"
                        name="user_id"
                        value={reservation.user_id || ''}
                        onChange={onChange}
                        required
                    >
                        <option value="">Sélectionner un adhérent</option>
                        {utilisateurs.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.nom}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sélection livre */}
                <div className="form-group">
                    <label htmlFor="livre_id">Livre :</label>
                    <select
                        id="livre_id"
                        name="livre_id"
                        value={reservation.livre_id || ''}
                        onChange={onChange}
                        required
                    >
                        <option value="">Sélectionner un livre </option>
                        {livres.map((livre) => (
                            <option key={livre.id} value={livre.id}>
                                {livre.titre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date début */}
                <div className="form-group">
                    <label htmlFor="date_debut">Date de début :</label>
                    <input
                        type="date"
                        id="date_debut"
                        name="date_debut"
                        value={reservation.date_debut || ''}
                        onChange={onChange}
                        required
                    />
                </div>

                {/* Date fin */}
                <div className="form-group">
                    <label htmlFor="date_fin">Date de fin :</label>
                    <input
                        type="date"
                        id="date_fin"
                        name="date_fin"
                        value={reservation.date_fin || ''}
                        onChange={onChange}
                        required
                    />
                </div>

                {/* Statut */}
                <div className="form-group">
                    <label htmlFor="status">Statut :</label>
                    <select
                        id="status"
                        name="status"
                        value={reservation.status || 'en attente'}
                        onChange={onChange}
                    >
                        <option value="en attente">En attente</option>
                        <option value="confirmée">Confirmée</option>
                        <option value="annulée">Annulée</option>
                    </select>
                </div>

                {/* Bouton */}
                <div className="form-group" style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Réservation en cours...' : 'Réserver'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormAjoutReservations
