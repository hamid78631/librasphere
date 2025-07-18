import { User } from 'lucide-react';
import '../../styles/Visiteur/ProfilConnecte.css';

function ProfilConnecte({ position = 'top-right' }) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  const isAuthenticated = !!token;
  let user = null;

  try {
    if (userRaw && userRaw !== "undefined") {
      user = JSON.parse(userRaw);
    }
  } catch (e) {
    console.error("❌ Erreur de parsing JSON user :", e);
  }

  console.log("🧪 ProfilConnecte → isAuthenticated:", isAuthenticated, "| user:", user);

  if (!isAuthenticated || !user) return null;

  return (
    <div className={`profil-connecte-container ${position}`}>
      <User size={28} strokeWidth={2.5} className="profil-icon" />
      <div className="profil-infos">
        <span className="nom-utilisateur">{user.nom}</span>
        <span className="statut-connecte">Connecté</span>
      </div>
    </div>
  );
}

export default ProfilConnecte;
