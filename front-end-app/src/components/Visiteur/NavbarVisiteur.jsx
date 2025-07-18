import { Link } from "react-router-dom";
import logo from '../../assets/Gif1.gif'
import { Home, BookOpen, Info, Mail, LogIn, UserPlus, LogOut } from "lucide-react";
import "../../styles/Visiteur/NavbarVisiteur.css";

function NavbarVisiteur() {
  const isConnected = !!localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.reload()
  }
  return (
    <header className="navbar-visiteur">
      <div className="nav-links">
        <div className="logo">
          <img src={logo} alt="librasphere" />
        </div>

        <Link to="/visiteur/accueil" className="nav-icon-link">
          <Home size={24} />
          <span>Accueil</span>
        </Link>

        <Link to="/visiteur/catalogue" className="nav-icon-link">
          <BookOpen size={24} />
          <span>Catalogue</span>
        </Link>

        <Link to="/apropos" className="nav-icon-link">
          <Info size={24} />
          <span>À propos</span>
        </Link>

        <Link to="/visiteur/contact" className="nav-icon-link">
          <Mail size={24} />
          <span>Contact</span>
        </Link>

        {!isConnected ? (
          <>
            <Link to="/visiteur/connexion" className="nav-icon-link">
              <LogIn size={24} />
              <span>Connexion</span>
            </Link>

            <Link to="/visiteur/inscription" className="nav-icon-link">
              <UserPlus size={24} />
              <span>Inscription</span>
            </Link>
          </>
        ) : (
            <button onClick={handleLogout} className="nav-icon-link logout-btn">
              <LogOut size={24} />
              <span>Déconnexion</span>
            </button>
        )}
      </div>
    </header>
  );
}

export default NavbarVisiteur;
