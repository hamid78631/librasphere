import { useEffect, useState } from 'react';
import '../../styles/Assistant/ModalUtilisateur.css';
import { X } from 'lucide-react';
import axios from 'axios';
import {toast, Toaster } from 'react-hot-toast'
function ModalUtilisateur({ visible, onClose }) {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) {
      axios.get('http://localhost:8000/api/users') // adapte la route si besoin
        .then(res => setUtilisateurs(res.data))
        .catch(err => console.error('Erreur chargement utilisateurs', err)
   );
    }
  }, [visible]);

  const filteredUsers = utilisateurs.filter(u => {
    const nom = u.nom?.toLowerCase() || '';
    const email = u.email?.toLowerCase() || '';
    return nom.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  if (!visible) return null;

  return (
    <div className="modal-utilisateur-overlay">
        <Toaster position ='top-right'/>
      <div className="modal-utilisateur-content">
        
        <div className="modal-utilisateur-header">
          <h3>Liste des utilisateurs</h3>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Rechercher par nom ou email"
          className="search-bar"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="modal-utilisateur-table-wrapper">
          <table className="modal-utilisateur-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Statut du compte </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.nom}</td>
                    <td>{user.email}</td>
                    <td>{user.statut_compte}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ModalUtilisateur;
