import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  BookOpen, 
  Users,  
  BarChart3 
} from 'lucide-react';
import Sidebar from '../Administrateur/Sidebar';
import { SideBarItem } from '../Administrateur/Sidebar';

function ParentHeader() {
  const location = useLocation();

  return (
    <div className="w-64 fixed h-full">
      <Sidebar>
        {/* <Link to="/admin">
          <SideBarItem 
            icon={<Home size={20} />} 
            text="Accueil" 
            active={location.pathname === '/admin'} 
            alert
          />
        </Link> */}
        <Link to="/admin/audit">
          <SideBarItem 
            icon={<FileText size={20} />} 
            text="Journal d'Audit" 
            active={location.pathname === '/admin/audit'} 
          />
        </Link>
        <Link to="/admin/livres">
          <SideBarItem 
            icon={<FileText size={20} />} 
            text="Gestion des livres" 
            active={location.pathname === '/admin/livres'} 
          />
        </Link>
        <Link to="/admin/emprunts">
          <SideBarItem 
            icon={<BookOpen size={20} />} 
            text="Emprunts" 
            active={location.pathname === '/admin/emprunts'} 
          />
        </Link>
        <Link to="/admin/utilisateurs">
          <SideBarItem 
            icon={<Users size={20} />} 
            text="Utilisateurs" 
            active={location.pathname === '/admin/utilisateurs'} 
          />
        </Link>
        <Link to="/admin/reservations">
          <SideBarItem 
            icon={<BookOpen size={20} />} 
            text="reservations" 
            active={location.pathname === '/admin/reservations'} 
          />
        </Link>
        <Link to="/admin/statistiques">
          <SideBarItem 
            icon={<BarChart3 size={20} />} 
            text="Statistiques" 
            active={location.pathname === '/admin/statistiques'} 
          />
        </Link>
      </Sidebar>
    </div>
  );
}

export default ParentHeader;