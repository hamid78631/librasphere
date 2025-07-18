import { User, Search } from 'lucide-react';
import logo from '../../assets/Logo.png';
import '../../styles/Assistant/AssistantTopBar.css'; 

function AssistantTopBar({searchItem , setSearchItem}) {
  return (
    <header className="assistant-topbar">
      {/* Logo + titre */}
      <div className="assistant-logo-section">
        <img src={logo} alt="Logo" className="assistant-logo" />
        <span className="assistant-title">ASSISTANT</span>
      </div>

      {/* Barre de recherche */}
      <div className="assistant-search-section">
        <input
          type="text"
          value={searchItem}
          onChange ={ (e) => setSearchItem(e.target.value)}
          placeholder="Rechercher un utilisateur , un livre , ..."
          className="assistant-search-input"
        />
        <Search className="assistant-search-icon" size={18} />
      </div>

      {/* Profil */}
      <div className="assistant-profile">
        <User size={20} />
      </div>
    </header>
  );
}

export default AssistantTopBar;
