import { Search } from 'lucide-react';
import '../../styles/Visiteur/SearchBar.css';

function SearchBar({ searchItem, setSearchItem }) {
  return (
    <div className="searchbar-glass">
      <input
        type="text"
        placeholder="Rechercher un livre, un auteur..."
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        className="searchbar-glass-input"
      />
      <button className="searchbar-glass-button">
        <Search size={20} />
      </button>
    </div>
  );
}

export default SearchBar;
