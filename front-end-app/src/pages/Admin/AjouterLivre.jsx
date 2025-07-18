import HALO from 'vanta/dist/vanta.halo.min'; 
import { useEffect, useRef, useState } from 'react';
import FormAjout from '../Admin/Formulaire/FormAjout';
import '../../styles/Admin/AjoutLivre.css';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AjouterLivre() {
  const vantaRef = useRef(null);
  // const [vantaEffect, setVantaEffect] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⏳ Charger Vanta uniquement quand le DOM est prêt
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
      amplitudeFactor: 4.0,
      size: 0.6,
    });
    setLoading(false); // ✅ Vanta prêt → loader terminé
  }

  return () => {
    if (effect) effect.destroy();
  };
}, []); // exécuter une seule fois au montage
 // surveille le ref DOM

  const [book, setBook] = useState({
    titre: '',
    auteur: '',
    description: '',
    categorie: '',
    quantite: 1,
    image: '',
  });

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === 'image') {
      setBook((prev) => ({ ...prev, image: files[0] }));
    } else {
      setBook((prev) => ({ ...prev, [name]: value }));
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(book).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else {
          formData.append(key, value);
        }
      });

      await axios.post('http://localhost:8000/api/livres', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Livre ajouté avec succès !');
      navigate('/admin/livres');
    }catch (error) {
  const message = error?.response?.data?.message || error.message;

  // Validation Laravel
  if (error.response?.status === 422 && error.response.data.errors?.titre) {
    toast.error("Un livre avec ce titre existe déjà!");
    return;
  }

  // Fallback
  if (
    message.includes("Integrity constraint violation") &&
    message.includes("Duplicate entry")
  ) {
    toast.error("Un livre avec ce titre existe déjà !");
  } else {
    toast.error("❌ Erreur lors de l’ajout du livre !");
    console.error('Erreur complète :', error);
  }
}

  };
    console.log('🔍 vantaRef.current :', vantaRef.current);
return (
  <div className="ajout-livre-global">


    <Toaster position="top-right" reverseOrder={false} />

    {/* ✅ Fond HALO plein écran – AUCUN enfant dedans */}
    <div ref={vantaRef} className="ajout-livre-bg" />

    {/* ✅ Loader ou contenu AU‑DESSUS du halo */}
    {loading ? (
      <div className="loader-container">
        <div className="loader-orb"></div>
        <div className="loader-text">Chargement du formulaire...</div>
      </div>
    ) : (
      <div className="ajout-livre-scroll">
        <FormAjout
          livre={book}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    )}
  </div>
);

}

export default AjouterLivre;
