import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import '../../styles/Assistant/ZoneRemarque.css'
import Swal from 'sweetalert2'

function ZoneRemarque({ empruntId }) {
  const [remarques, setRemarques] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleDelete = async (id) => {
    Swal.fire({
          title: 'Confirmer la suppressions de cette remarque',
          text : `Voulez-vous vraiment cette remarque ?`,
          icon : 'warning',
          showCancelButton : true , 
          confirmButtonColor: '#7c3aed',
          cancelButtonColor: '#d33',
          confirmButtonText : 'Oui , confirmer'
        }).then((result) => {
            if(result.isConfirmed){
                 axios.delete(`http://localhost:8000/api/remarques/${id}`)
                .then( () => {
                    setRemarques(prev => prev.filter( (remarque) => remarque.id !== id))
                    toast.success('Supprimé avec succès !')
                }
                ).catch(err => {
            toast.error('Erreur lors de la suppression');
            console.error('Erreur :', err);
          }) 
                }
            
        })
        
  }
  useEffect(() => {
    if (!empruntId) return;


    axios.get(`http://localhost:8000/api/remarques/emprunt/${empruntId}`)
      .then(res => {
        setRemarques(res.data);
        //toast.success('Remarques chargées');
        console.log('Remarques chargées avec succès ')
        setLoading(false);
      })
      .catch(err => {
        toast.error('Erreur lors du chargement des remarques');
        console.error('Erreur :', err);
        setLoading(false);
      });
  }, [empruntId]);

  return (
    <div className="zone-remarque">
      
      {loading ? (
        <p>Chargement des remarques...</p>
      ) : remarques.length > 0 ? (
        <ul className="remarque-liste">
          {remarques.map((remarque) => (
            <li key={remarque.id} className="remarque-item">
              📝 {remarque.contenu}
              <br />
              <small className="remarque-date">
                {new Date(remarque.created_at).toLocaleString()}
              </small>
              <button className="btn-delete-remarque" onClick={ () => handleDelete(remarque.id)}>Supprimer</button>
            </li>
          ))
          }
        </ul>
      ) : (
        <p>Aucune remarque pour cet emprunt.</p>
      )}
    </div>
  );
}

export default ZoneRemarque;
