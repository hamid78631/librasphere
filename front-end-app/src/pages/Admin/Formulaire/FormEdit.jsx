import '../../../styles/Admin/FormulaireEdit.css';
import logo from '../../../assets/Logo.png';
import { useState } from 'react';

function FormEdit({ livre, onChange, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  if (!livre) return <p>Chargement...</p>;

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
    <div className="form-edit-wrapper">
      <form onSubmit={handleLocalSubmit} className="form-edit">
        {/* Logo centré et réduit */}
        <div className="form-logo-wrapper">
          <img
            src={logo}
            alt="logo Librasphere"
            style={{
              width: '150px',
              height: 'auto',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        </div>

        <h1 className="form-title">Modifier le livre : {livre.titre}</h1>

        <label htmlFor="titre">Titre</label>
        <input
          id="titre"
          type="text"
          name="titre"
          value={livre.titre}
          onChange={onChange}
          required
        />

        <label htmlFor="auteur">Auteur</label>
        <input
          id="auteur"
          type="text"
          name="auteur"
          value={livre.auteur}
          onChange={onChange}
          required
        />

        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          name="description"
          value={livre.description}
          onChange={onChange}
          required
        />

        <label htmlFor="categorie">Catégorie</label>
        <input
          id="categorie"
          type="text"
          name="categorie"
          value={livre.categorie}
          onChange={onChange}
          required
        />

        <label htmlFor="quantite">Quantité</label>
        <input
          id="quantite"
          type="number"
          name="quantite"
          value={livre.quantite}
          onChange={onChange}
          required
        />

        {/* Aperçu de l'image actuelle si elle existe */}
        {livre?.image && !(livre.image instanceof File) && (
          <div className="image-apercu">
            <p><strong>Image actuelle :</strong></p>
            <img
              src={`http://localhost:8000/storage/${livre.image}`}
              alt="Image actuelle"
              style={{ width: '120px', borderRadius: '10px', marginBottom: '10px' }}
            />
            <p style={{
              fontSize: '0.9rem',
              color: '#F97316',
              fontWeight: '900'
            }}>
              Si vous ne sélectionnez pas de nouvelle image, l'image actuelle sera conservée.
            </p>
          </div>
        )}

        {/* Champ de modification de l'image */}
        <label htmlFor="image"><strong>Changer l’image (optionnel)</strong></label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={onChange}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? '⏳ Modification...' : 'Modifier'}
        </button>
      </form>
    </div>
  );
}

export default FormEdit;
