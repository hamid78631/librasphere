import { useEffect, useState, useRef } from 'react';
import HALO from 'vanta/src/vanta.halo';
import { useParams, useNavigate } from 'react-router-dom';
import FormEditUser from '../Admin/Formulaire/FormEditUser.jsx';
import '../../styles/Admin/EditLivre.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function EditUser() {
  const vantaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Chargement des données utilisateur
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Erreur lors du chargement de l'utilisateur !");
        console.error("Erreur de chargement :", err);
        setLoading(false);
      });
  }, [id]);

  // Initialisation Vanta uniquement quand le DOM est prêt
  useEffect(() => {
    if (!vantaRef.current) return;

    const effect = HALO({
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

    return () => {
      if (effect) effect.destroy();
    };
  }, [loading]);

  // Gestion des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    toast.error('Utilisateur introuvable');
    return;
  }

  try {
    const formData = new FormData();

    // N'ajouter que les champs modifiables
    const champs = ['nom', 'prenom', 'email', 'telephone', 'role', 'statut'];

    champs.forEach((champ) => {
      if (user[champ] !== undefined && user[champ] !== null) {
        formData.append(champ, user[champ]);
      }
    });

    const response = await axios.post(
      `http://localhost:8000/api/users/${id}?_method=PUT`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    toast.success('Utilisateur modifié avec succès !');
    navigate('/admin/utilisateurs');
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error("❌ Erreur lors de la modification :", message);
    toast.error("Erreur lors de la modification !");
  }
};


  return loading ? (
    <div className="loader-container">
      <div className="loader-orb"></div>
      <div className="loader-text">Chargement de l'utilisateur...</div>
    </div>
  ) : (
    <div className="edit-livre-global">
      <div ref={vantaRef} className="edit-livre-bg" />
      <div className="edit-livre-scroll">
        <FormEditUser user={user} onChange={handleChange} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default EditUser;
