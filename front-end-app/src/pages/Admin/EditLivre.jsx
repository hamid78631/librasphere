import { useEffect, useState, useRef } from 'react';
import HALO from 'vanta/src/vanta.halo';
import { useParams, useNavigate } from 'react-router-dom';
import FormEdit from '../Admin/Formulaire/FormEdit.jsx';
import '../../styles/Admin/EditLivre.css';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

function EditLivre() {
  const vantaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [livre, setLivre] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Chargement du livre
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/livres/${id}`)
      .then((res) => {
        setLivre(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error('Erreur lors du chargement du livre !');
        console.error('Erreur lors du chargement du livre !', err);
        setLoading(false);
      });
  }, [id]);

  // Initialisation Vanta
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

  // Gestion des champs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setLivre((prev) => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value,
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!livre) {
      toast.error('Livre introuvable');
      return;
    }

    try {
      const formData = new FormData();
      const champs = ['titre', 'auteur', 'description', 'categorie', 'quantite'];

      champs.forEach((champ) => {
        if (livre[champ] !== undefined && livre[champ] !== null) {
          formData.append(champ, livre[champ]);
        }
      });

      if (livre.image instanceof File) {
        formData.append('image', livre.image);
      }

      console.log('📤 Données envoyées à Laravel :');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await axios.post(`http://localhost:8000/api/livres/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Livre modifié avec succès !');
      navigate('/admin/livres');
    } catch (error) {
      const message = error.response?.data?.message || error.message;

      console.error('❌ Erreur lors de la modification :', message);
      toast.dismiss()
      if (
        message.includes("Integrity constraint violation") &&
        message.includes("Duplicate entry")
      ) {
        toast.error("Ce titre existe déjà dans la bibliothèque !Vueillez changer le titre");
      } else {
        toast.error("Erreur lors de la modification : " );
      }
    }
  };

  // Affichage
  return loading ? (
    <div className="loader-container">
      <div className="loader-orb"></div>
      <div className="loader-text">Chargement en cours...</div>
    </div>
  ) : (
    <div className="edit-livre-global">
       <Toaster position="top-right" reverseOrder={false} />
      <div ref={vantaRef} className="edit-livre-bg" />
      <div className="edit-livre-scroll">
        <FormEdit livre={livre} onChange={handleChange} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default EditLivre;
