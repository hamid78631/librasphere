import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import '../../styles/Admin/AuditUser.css';
import UserDetailsModal from './UserDetailsModal';

function AuditUser({ searchItem }) {
  const [ListeUser, setListeUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser , setSelectedUser] = useState(null)
  useEffect(() => {
    axios.get('http://localhost:8000/api/users')
      .then(res => setListeUser(res.data))
      .catch((err) => {
        toast.error("Échec du chargement des utilisateurs !");
        console.error('Erreur lors du chargement :', err);
      })
      .finally(() => setLoading(false));
  }, []);

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
        axios.delete(`http://localhost:8000/api/users/${id}`)
          .then(() => {
            setListeUser(prev => prev.filter(user => user.id !== id));
            toast.success("Utilisateur supprimé avec succès !");
          })
          .catch((err) => {
            toast.error("Erreur lors de la suppression !");
            console.error("Erreur lors de la suppression !", err);
          });
      }
    });
  };

  // Filtrage dynamique en fonction du texte tapé
const filteredUsers = ListeUser.filter(user => {
  if (!searchItem) return true;
  return Object.values(user).some(val =>
    val && String(val).toLowerCase().includes(searchItem.toLowerCase())
  );
});

  return (
    <div className="audit-user-container page-content">
      <Toaster position="top-right" reverseOrder={false} />
{/* Modale de détails du livre */}
      <UserDetailsModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
      {loading ? (
        <div className="loader-container">
          <div className="loader-orb"></div>
          <div className="loader-text">Chargement en cours...</div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="audit-user-card"
        >
          <div className="audit-user-header">
            <h1 className="audit-user-title">Informations sur les utilisateurs</h1>
            <Link to='/admin/users/ajoutUser' className="audit-user-add">
              + Ajouter un utilisateur
            </Link>
          </div>

          <div className="audit-user-table-wrapper">
            <table className="audit-user-table">
              <thead>
                <tr>
                  <th>Nom complet</th>
                  <th>Numéro d'identité</th>
                  <th>Mot de passe</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Date d'inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}
                    onClick={() =>
                      setSelectedUser({
                        nom : user.nom , 
                        email : user.email, 
                        role : user.role , 
                        statut: user.statut, 
                        date_inscription : user.date_inscription
                      })
                      
                    }className="cursor-pointer hover:bg-gray-100"
                    >
                      <td data-label="Nom complet">{user.nom}</td>
                      <td data-label="Numéro d'identité">{user.numero_identite}</td>
                      <td data-label="Mot de passe">{user.password}</td>
                      <td data-label="Email">{user.email}</td>
                      <td data-label="Rôle">{user.role}</td>
                      <td data-label="Statut">{user.statut}</td>
                      <td data-label="Date d'inscription">{user.date_inscription}</td>
                      <td data-label="Actions" className="audit-user-actions">
                        <Link to={`/admin/users/editUser/${user.id}`} className="btn-modifier" 
                        onClick={(e) => e.stopPropagation()}>
                          Modifier
                        </Link>
                        <button onClick={(e) => {
                        handleClick(user.id)
                        e.stopPropagation();
                      }} 
                        className="btn-supprimer">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '1rem', color: 'gray' }}>
                      Aucun utilisateur correspondant.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AuditUser;
