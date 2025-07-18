import '../../../styles/Admin/FormulaireEdit.css';
import logo from '../../../assets/Logo.png';
import { useState } from 'react';

function FormAjout({ livre, onChange, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

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
    <div>
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
              marginRight: 'auto'
            }}
          />
        </div>

        <h1 className="form-title">Ajouter un livre</h1>

        <label htmlFor="titre">Titre</label>
        <input
          type="text"
          name="titre"
          value={livre.titre}
          onChange={onChange}
          required
        />

        <label htmlFor="auteur">Auteur</label>
        <input
          type="text"
          name="auteur"
          value={livre.auteur}
          onChange={onChange}
          required
        />

        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          value={livre.description}
          onChange={onChange}
          required
        />

        <label htmlFor="categorie">Catégorie</label>
        <input
          type="text"
          name="categorie"
          value={livre.categorie}
          onChange={onChange}
          required
        />

        <label htmlFor="quantite">Quantité</label>
        <input
          type="number"
          name="quantite"
          value={livre.quantite}
          onChange={onChange}
          required
        />

        <label htmlFor="image">Image</label>
        <input
          type="file"
          name="image"
          id="image"
          onChange={onChange}
          accept="image/*"
        />

        <button type="submit" disabled={submitting}>
          {submitting ? '⏳ Ajout en cours...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}

export default FormAjout;
