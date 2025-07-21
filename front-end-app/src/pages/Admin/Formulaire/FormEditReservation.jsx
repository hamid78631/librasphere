import logo from '../../../assets/Logo.png';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import '../../../styles/Admin/Formulaires/FormEditReservations.css'
function FormEditReservation({ reservation, onChange, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);
  const [livres, setLivres] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/livres')
      .then((res) => setLivres(res.data))
      .catch((err) => {
        toast.error('Erreur lors du chargement des livres');
        console.error('Erreur livres :', err);
      });

    axios
      .get('http://localhost:8000/api/users')
      .then((res) => setUtilisateurs(res.data))
      .catch((err) => {
        toast.error('Erreur lors du chargement des utilisateurs');
        console.error('Erreur utilisateurs :', err);
      });
  }, []);

  if (!reservation) return null;

  const handleLocalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-reservation-container">
      <form onSubmit={handleLocalSubmit} className="edit-reservation-form">
        <div className="form-logo-wrapper">
          <img
            src={logo}
            alt="logo Librasphere"
            className="form-logo"
            style={{
                              width: '150px',
                              height: 'auto',
                              display: 'block',
                              marginLeft: 'auto',
                              marginRight: 'auto'
                            }}
          />
        </div>

        <h1 className="form-title">Modifier la réservation</h1>

        <label className="form-label">Utilisateur :</label>
        <select
          name="utilisateur"
          value={reservation.utilisateur || ''}
          onChange={onChange}
          className="form-input"
          required
        >
          <option value="">Choisir un utilisateur </option>
          {utilisateurs.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nom} {user.prenom}
            </option>
          ))}
        </select>

        <label className="form-label">Livre :</label>
        <select
          name="livre"
          value={reservation.livre || ''}
          onChange={onChange}
          className="form-input"
          required
        >
          <option value="">Choisir un livre </option>
          {livres.map((livre) => (
            <option key={livre.id} value={livre.id}>
              {livre.titre}
            </option>
          ))}
        </select>

        <label className="form-label">Date de fin :</label>
        <input
          type="date"
          name="date_fin"
          value={reservation.date_fin}
          placeholder={reservation.date_fin}
          onChange={onChange}
          className="form-input"
          required
        />

        <label className="form-label">Statut :</label>
        <select
          name="statut"
          value={reservation.statut || ''}
          onChange={onChange}
          className="form-input"
          required
        >
          <option value="en_attente">En attente</option>
          <option value="confirmée">Confirmée</option>
          <option value="annulée">Annulée</option>
        </select>

        <button
          type="submit"
          disabled={submitting}
          className="form-button"
        >
          {submitting ? '⏳ Modification en cours...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}

export default FormEditReservation;
