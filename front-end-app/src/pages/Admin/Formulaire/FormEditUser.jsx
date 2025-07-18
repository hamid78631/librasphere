import '../../../styles/Admin/Formulaires/FormEditUser.css';
import logo from '../../../assets/Logo.png';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function FormEditUser({ user, onChange, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleLocalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(e); // Appel de la fonction parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleLocalSubmit} className="form-edit">
        {/* Logo centré */}
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

        <h1 className="form-title">Modifier l'utilisateur</h1>

        <label htmlFor="nom">Nom</label>
        <input
          type="text"
          name="nom"
          value={user.nom || ''}
          onChange={onChange}
          required
        />

        <label htmlFor="numero_identite">Numéro d'identité</label>
        <input
          type="text"
          name="numero_identite"
          value={user.numero_identite || ''}
          onChange={onChange}
          required
          disabled
        />

        <label htmlFor="password">Mot de passe</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={user.password || ''}
            onChange={onChange}
            required
            style={{ paddingRight: '2.5rem' }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              top: '50%',
              right: '1rem',
              transform: 'translateY(-50%)',
              cursor: 'pointer'
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <label htmlFor="role">Rôle</label>
        <select name="role" value={user.role || ''} onChange={onChange} required>
          <option value="">Sélectionner un rôle</option>
          <option value="admin">👑 Admin</option>
          <option value="assistant">📚 Bibliothécaire</option>
          <option value="adherent">👤 Adhérent</option>
        </select>

        <label htmlFor="statut">Statut</label>
        <select name="statut" value={user.statut || ''} onChange={onChange} required>
          <option value="">Sélectionner un statut</option>
          <option value="actif">✅ Actif</option>
          <option value="inactif">🚫 Inactif</option>
          <option value="suspendu">⛔ Suspendu</option>
        </select>

        <button type="submit" disabled={submitting}>
          {submitting ? '⏳ Modification en cours...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}

export default FormEditUser;
