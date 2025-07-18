import { MoreVertical, ChevronFirst, ChevronLast } from 'lucide-react';
import { useContext, createContext, useState } from 'react';
import '../../styles/Admin/sidebar.css';
import Logo from '../../assets/Logo1.png'

const SidebarContext = createContext();

function Sidebar({ children }) {
  const [ expanded, setExpanded ] = useState(true);

  return (
    <aside className={`sidebar ${!expanded ? 'collapsed' : ''}`}>
      <nav className="flex flex-col h-full justify-between">
        {/* Partie haute : Logo + Menu */}
        <div>
          {/* Logo + Toggle */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <div className="sidebar-logo-wrapper">
              <img
                src={Logo}
                alt="Logo Librasphere"
                className={`sidebar-logo ${!expanded ? 'collapsed' : ''}`}
              />
            </div>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="sidebar-toggle"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          {/* Liens de navigation */}
          <div className="pt-6">
            <SidebarContext.Provider value={{ expanded }}>
              <ul className="sidebar-menu">
                {children}
              </ul>
            </SidebarContext.Provider>
          </div>
        </div>

        {/* Partie basse : Profil */}
        <div className="sidebar-footer">
          {/* <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="Profil"
          /> */}
          <div className={`sidebar-footer-info ${!expanded ? 'collapsed' : ''}`}>
            {/* <h4 className="font-semibold text-gray-800">John Doe</h4>
            <span className="text-xs text-gray-500">admin@librasphere.com</span> */}
          </div>
          <MoreVertical size={20} className="ml-auto text-gray-400" />
        </div>
      </nav>
    </aside>
  );
}


export function SideBarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`sidebar-item ${active ? 'active' : ''}`}
    >
      <div className="sidebar-item-icon">{icon}</div>
      {expanded && <span>{text}</span>}
      {alert && <div className="sidebar-alert" />}
    </li>
  );
}

export default Sidebar;
