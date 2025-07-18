import { Routes, Route } from 'react-router-dom';
import Audit from './pages/Admin/Audit.jsx';
import Emprunt from './pages/Admin/Emprunt.jsx';
import Livres from './pages/Admin/Livres.jsx';
import Stats from './pages/Admin/Stats.jsx';
import Users from './pages/Admin/Users.jsx';
import EditLivre from './pages/Admin/EditLivre.jsx';
import AjouterLivre from './pages/Admin/AjouterLivre.jsx';
import AjouterUser from './pages/Admin/AjouterUser.jsx';
import EditUser from './pages/Admin/EditUser.jsx';
import AjouterEmprunt from './pages/Admin/AjouterEmprunt.jsx';
import DashboardAssistant from './pages/Assistant/DashboardAssistant.jsx';
import AddEmprunt from './pages/Assistant/AddEmprunt.jsx';
import PagePenalite from './pages/Assistant/PagePenalite.jsx';
import AddPenalite from './pages/Assistant/AddPenalite.jsx';
import AccueilVisiteur from './pages/Visiteur/AccueilVisiteur.jsx';
import InscriptionVisiteur from './pages/Visiteur/InscriptionVisiteur.jsx';
import ConnexionVisiteur from './pages/Visiteur/ConnexionVisiteur.jsx';
import ContactVisiteur from './pages/Visiteur/ContactVisiteur.jsx'
import CataloguePublic from './pages/Visiteur/CataloguePublic.jsx';
import Reservations from './pages/Admin/Reservations.jsx';
function App() {

  return (


    <Routes>

      {/* ROUTES CONCERNANT L'ADMINISTRATION */}
      <Route path="/admin/audit" element={<Audit/>} />
      <Route path="/admin/emprunts" element={<Emprunt />} />
      <Route path="/admin/livres" element={<Livres />} />
      <Route path="/admin/statistiques" element={<Stats />} />     
      <Route path='/admin/reservations' element={<Reservations/>} />
      <Route path="/admin/utilisateurs" element={<Users />} />
    {/* Formulaires pour les livres */}
      <Route path='/admin/livres/edit/:id' element={<EditLivre />}/>
      <Route path='/admin/livres/ajoutLivre' element={<AjouterLivre />}/>
      {/* Formulaire pour les utilisateurs */}
      <Route path='/admin/users/ajoutUser' element={<AjouterUser />}/>
      <Route path='/admin/users/editUser/:id' element={<EditUser />} />
      <Route path='/admin/emprunts/ajouter' element={<AjouterEmprunt />} />

      {/* ROUTES CONCERNANT L'ASSISTANCE */}
      <Route path='/assistant/dashboard' element={<DashboardAssistant /> }/>
      <Route path='/assistant/emprunts/ajouter' element={<AddEmprunt />} />
      <Route path='/assistant/penalite/ajouter' element={<AddPenalite />}/>
      <Route path='/assistant/penalite' element={<PagePenalite />} />

      {/* ROUTES CONCERNANT L'INTERFACE VISITEUR */}
      <Route path='/visiteur/accueil' element={<AccueilVisiteur />}/>
      <Route path='/visiteur/inscription' element={<InscriptionVisiteur />}  />
      <Route path='/visiteur/connexion' element={<ConnexionVisiteur />}  />
      <Route path='/visiteur/contact' element={<ContactVisiteur />} />
      <Route path='/visiteur/catalogue' element={<CataloguePublic />} />
      
    </Routes>
  );
}

export default App;
