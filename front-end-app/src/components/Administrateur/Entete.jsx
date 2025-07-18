import { useState, useEffect } from 'react';
import {
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid';
// import { PersonOutlined } from '@mui/icons-material';
// import {Settings} from '@mui/material'
import '../../styles/Entete.css';

function Entete({searchItem , setSearchItem}) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="entete">
      <div className="entete-container">
        {/* Barre de recherche */}
        <div className="entete-search">
          <input 
          type="text" 
          placeholder="Rechercher..."
          value={searchItem}
          onChange ={ (e) => setSearchItem(e.target.value)} />
          <MagnifyingGlassIcon />
        </div>

        {/* Icônes */}
        <div className="entete-icons">
          <button onClick={toggleTheme}>
            {theme === 'light' ? (
              <MoonIcon className="icon-theme" />
            ) : (
              <SunIcon className="icon-theme icon-sun" />
            )}
          </button>
          <UserCircleIcon className="icon-user" />
          {/* <PersonOutlined />
          <Settings/> */}
        </div>
      </div>
    </header>
  );
}

export default Entete;
