import { useEffect, useRef, useState } from 'react';
import HALO from 'vanta/src/vanta.halo';
import { useNavigate } from 'react-router-dom';
import FormAjoutUser from '../Admin/Formulaire/FormAjoutUser';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import '../../styles/Admin/AjoutLivre.css';

function AjouterUser() {
  const vantaRef = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    numero_identite: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation : '',
    role: '',
    statut: 'actif',
  });

  useEffect(() => {
    let effect = null;
    if (vantaRef.current) {
      effect = HALO({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        baseColor: 0x0,
        xOffset: 0.08,
        amplitudeFactor: 3.0,
        size: 0.6,
      });
      setLoading(false);
    }

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.post('http://localhost:8000/api/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Utilisateur ajouté avec succès !');
      navigate('/admin/utilisateurs');
    } catch (error) {
      const status = error?.response?.status;
      const errors = error?.response?.data?.errors;

      console.error('Erreur lors de l’ajout :', error);
     console.log("🧩 Erreurs Laravel :", errors);
     console.log("erreur dans laravel : ",user.password)
      if (status === 422 && errors) {
        if (errors.numero_identite) {
          toast.error("Il existe déjà un utilisateur avec ce numéro d'identite");
        } else if (errors.email) {
          toast.error("Il existe déjà un utilisateur avec cet email");
        }else if (errors.password){
            toast.error("Le mot de passe doit contenir au moins 8caractères!")
            toast.error("Les mots de passes ne sont pas equivalentes!")
        }
         else {
          toast.error('Veuillez corriger les erreurs du formulaire.');
        }
      } else {
        toast.error('Erreur inattendue lors de l’ajout.');
      }
    }
  };

  return (
    <div className="ajout-livre-global">
      <Toaster position="top-right" reverseOrder={false} />

      <div ref={vantaRef} className="ajout-livre-bg" />

      {loading ? (
        <div className="loader-container">
          <div className="loader-orb"></div>
          <div className="loader-text">Chargement du formulaire...</div>
        </div>
      ) : (
        <div className="ajout-livre-scroll">
          <FormAjoutUser user={user} onChange={handleChange} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}

export default AjouterUser;
