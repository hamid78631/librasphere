import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import '../../../styles/Assistant/Penalite/TableauPenalites.css';
import Select from 'react-select'


function TableauPenalite({searchItem}) {
  const [penalites, setPenalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);  // État pour afficher/cacher le tableau
  const [lastPage , setLastPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  //Filtrer le tableau par statut 
  const [statutFilter , setStatutFilter] = useState('')

  const statutOptions = [
    {value : '' , label : 'Tous les statuts'},
    {value : 'active', label : 'Active'} , 
    {value : 'levee' , label : 'Levée'}
  ]

  const customStyles = {
  control: (base) => ({
    ...base,
    borderRadius: "12px",
    borderColor: "#c084fc",
    boxShadow: "none",
    padding: "2px 4px",
    "&:hover": {
      borderColor: "#a855f7"
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999
  })
};


  const actualiser = () => {
    setLoading(true);
    axios.get('http://localhost:8000/api/penalites')
      .then(res => {
        setPenalites(res.data.penalites || res.data.data || []);
        setLastPage(res.data.last_page || 1);
        toast.success('Pénalités récupérées avec succès');
      })
      .catch(err => {
        toast.error('Erreur de chargement des pénalités !');
        console.error('Erreur :', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    actualiser();
  }, [currentPage]);

  const handleSupprimerPenalite = (id) => {
    Swal.fire({
      title: 'Supprimer cette pénalité ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4f46e5',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8000/api/penalites/${id}`)
          .then(res => {
            setPenalites(res.data.penalites);
            toast.success(res.data.message);
            actualiser();
          })
          .catch(err => {
            toast.error('Erreur lors de la suppression !');
            console.error('Erreur :', err);
          });
      }
    });
  };

  const handleLeverPenalite = (id) => {
    Swal.fire({
      title: 'Lever cette pénalité ?',
      text: "L'utilisateur sera débloqué.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#4f46e5',
      confirmButtonText: 'Oui, lever',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:8000/api/penalites/${id}/lever`)
          .then(res => {
            setPenalites(res.data.penalites);
            toast.success('Pénalité levée !');
            actualiser();
          })
          .catch(err => {
            toast.error("Erreur lors de la levée !");
            console.error('Erreur :', err);
          });
      }
    });
  };

  const handleAfficherPenalite = (penalite) => {
    Swal.fire({
      title: 'Détails de la pénalité',
      html: `
        <p><strong>Emprunteur:</strong> ${penalite.utilisateur}</p>
        <p><strong>Livre:</strong> ${penalite.livre}</p>
        <p><strong>Type:</strong> ${penalite.type}</p>
        <p><strong>Description:</strong> ${penalite.description}</p>
        <p><strong>Date Pénalité:</strong> ${penalite.date_penalite}</p>
        <p><strong>Date Déblocage:</strong> ${penalite.date_deblocage || 'Non-définie'}</p>
        <p><strong>Statut:</strong> ${penalite.statut}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#4f46e5'
    });
  };

   const query = searchItem?.toLowerCase() || "";

  const penalitesFiltrees = (penalites || []).filter((p) => {
    const statutMatch = statutFilter ? p.statut?.toLowerCase() === statutFilter.toLowerCase() : true;

    const nom = p.utilisateur?.nom?.toLowerCase() || '';
    const motif = p.description?.toLowerCase() || '';
    const type = p.type?.toLowerCase() || '';
    const searchMatch = nom.includes(query) || motif.includes(query) || type.includes(query);

    return statutMatch && searchMatch;
  });


  return (
    <div className="tableau-penalites">
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      {/* Bouton afficher/cacher */}
      <button
        className="btn-afficher fade-in"
        onClick={() => setVisible(!visible)}
        style={{ marginBottom: '15px' }}
      >
        {visible ? 'Cacher le tableau' : 'Afficher le tableau'}
      </button>

      {loading ? (
        <div className="loader-container">
          <div className="loader-orb"></div>
          <div className="loader-text">Chargement des emprunts...</div>
        </div>
      ) : (
        visible && (
          <div>
            <h2 className="titre-section">Tableau des pénalités</h2>
            <div className="filters-bar">
              <label style={{ marginRight : '8px', fontWeight:'bold'}}>Filtrer par statut</label>
              <Select 
                options={statutOptions}
                styles ={customStyles}
                onChange = {(selected) => setStatutFilter(selected.value)}
                defaultValue={statutOptions[0]}
                isSearchable={false}
                placeholder='Choisir un statut'
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Emprunteur</th>
                  <th>Livre</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date Pénalité</th>
                  <th>Date Déblocage</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {penalites.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      Aucune pénalité appliquée pour l'instant.
                    </td>
                  </tr>
                ) : (
                  
                  penalitesFiltrees.map((penalite) => (
                    <tr key={penalite.id}>
                      <td>{penalite.utilisateur?.nom || 'Nom manquant'}</td>
                      <td>{penalite.livre}</td>
                      <td>{penalite.type}</td>
                      <td>{penalite.description}</td>
                      <td>{penalite.date_penalite}</td>
                      <td>{penalite.date_deblocage || 'Non-définie'}</td>
                      <td>
                        <span
                          className={`badge ${
                            penalite.statut === 'active'
                              ? 'badge-red'
                              : 'badge-green'
                          }`}
                        >
                          {penalite.statut}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn-afficher"
                          onClick={() => handleAfficherPenalite(penalite)}
                        >
                          Afficher
                        </button>
                        <button
                          className="btn-supprimer"
                          onClick={() => handleSupprimerPenalite(penalite.id)}
                        >
                          Supprimer
                        </button>
                        {penalite.statut === 'active' && (
                          <button
                            className="btn-lever"
                            onClick={() => handleLeverPenalite(penalite.id)}
                          >
                            Lever
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="pagination-controls">
            {/* Bouton de pagination */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Précédent
            </button>

            <span>Page {currentPage} / {lastPage}</span>

            <button
              disabled={currentPage === lastPage}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Suivant
            </button>
          </div>
                          
          </div>
        )
      )}
    </div>
  );
}

export default TableauPenalite;
