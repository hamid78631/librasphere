import axios from 'axios'
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../styles/Admin/AuditLivres.css';
import { toast, Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import book from '../../assets/bookk.png';
import BookDetailsModal from '../Administrateur/BookDetailsModal';

function AuditLivres({ searchItem }) {
  const [livresListe, setLivresListe] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/livres')
      .then(res =>{
        if(res.data?.length === 0 ){
          toast.info('Aucun livre pour l\'instant')
        } 
        setLivresListe(res.data)
      })
      .catch(err => {
        toast.error("Échec du chargement des livres !");
        console.error("Erreur de chargement :", err);
      })

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
        axios.delete(`http://localhost:8000/api/livres/${id}`)
          .then(() => {
            setLivresListe(prev => prev.filter((livre) => livre.id !== id));
            toast.success("Livre supprimé avec succès !");
          })
          .catch((err) => {
            toast.error("Erreur lors de la suppression");
            console.log('Erreur lors de la suppression !', err)
          });
      }
    });
  };

  const filteredLivres = livresListe.filter((livre) => {
    if (!searchItem) return true;
    return Object.values(livre).some(val =>
      val && String(val).toLowerCase().includes(searchItem.toLowerCase())
    );
  });

  return (
    <div className="livres-container">
      <Toaster position='top-right' reverseOrder={false} />

      {/* Modale de détails du livre */}
      <BookDetailsModal
        book={selectedBook}
        open={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      {/* {loading ? (
        <div className="loader-container">
          <div className="loader-orb"></div>
          <div className="loader-text">Chargement en cours...</div>
        </div>
      )  */}
        <motion.div
          className="livres-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="livres-title">Informations sur les livres</h1>
          <div className="mb-6">
            <Link to="/admin/livres/ajoutLivre" className="livres-ajout">
              + Ajouter un livre
            </Link>
            <br /><br />
          </div>

          <div className="overflow-x-auto">
            <table className="livres-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Titre</th>
                  <th>Auteur</th>
                  <th>Description</th>
                  <th>Catégorie</th>
                  <th>Quantité</th>
                  <th>Date d'ajout</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLivres.length > 0 ? (
                  filteredLivres.map((livre) => (
                    <tr
                      key={livre.id}
                      onClick={() =>
                        setSelectedBook({
                          titre: livre.titre,
                          auteur: livre.auteur,
                          description: livre.description,
                          categorie: livre.categorie,
                          quantite: livre.quantite,
                          date_ajout: livre.date_ajout,
                          image: livre.image
                            ? `http://localhost:8000/storage/${livre.image}`
                            : book,
                          rating: livre.note ?? 4 // Valeur par défaut si pas de note
                        })
                      }
                      className="cursor-pointer hover:bg-gray-700"
                    >
                      <td>
                        <img
                          src={livre.image ? `http://localhost:8000/storage/${livre.image}` : book}
                          alt={livre.titre}
                          className="livres-image"
                        />
                      </td>
                      <td>{livre.titre}</td>
                      <td>{livre.auteur}</td>
                      <td>{livre.description}</td>
                      <td>{livre.categorie}</td>
                      <td>{livre.quantite}</td>
                      <td>{livre.date_ajout}</td>
                      <td className="livres-actions">
                        <Link
                          to={`/admin/livres/edit/${livre.id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClick(livre.id);
                          }}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '1rem', color: 'gray' }}>
                      Aucun livre correspondant.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      
    </div>
  );
}

export default AuditLivres;
