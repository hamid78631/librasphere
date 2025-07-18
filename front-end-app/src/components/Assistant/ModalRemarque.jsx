import { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../../styles/Assistant/ModalEmprunt.css';

function ModalEmprunt({ isOpen, onClose, emprunts }) {
  const [empruntId, setEmpruntId] = useState('');
  const [contenu, setContenu] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8000/api/remarques', {
        emprunt_id: empruntId,
        contenu: contenu
      });
      toast.success('Remarque ajoutée avec succès !');
      onClose();
      setEmpruntId('');
      setContenu('');
    } catch (err) {
      toast.error("Erreur lors de l'ajout !");
      console.error('Erreur :', err);
    }
  };

  if (!isOpen) return null;

  const empruntFilters = emprunts.filter( emprunt => emprunt.statut ==='en_retard')
  return (
    <div className="modal-overlay">
      <Toaster position="top-right" />
      <div className="modal-container">
        <h2 className="modal-title">Ajouter une remarque</h2>

        <select
          value={empruntId}
          onChange={(e) => setEmpruntId(e.target.value)}
          className="modal-select"
        >
          <option value="">Choisir un emprunt</option>
          {empruntFilters.map((emprunt) => (
            <option key={emprunt.id} value={emprunt.id}>
              📘 {emprunt.livre.titre} — {emprunt.utilisateur.nom}
            </option>
          ))}
        </select>

        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Écrire votre remarque ici..."
          className="modal-textarea"
          rows={5}
        />

        <div className="modal-actions">
          <button onClick={onClose} className="modal-cancel">Annuler</button>
          <button onClick={handleSubmit} className="modal-confirm">Ajouter</button>
        </div>
      </div>
    </div>
  );
}

export default ModalEmprunt;
