import PageBackground from "../../components/Assistant/Penalites/PageBackground";
import { Plus } from "lucide-react";
import "../../styles/Assistant/Penalite/PagePenalite.css";
import TableauPenalite from "../../components/Assistant/Penalites/TableauPenalite";
import AssistantTopBar from "../../components/Assistant/AssistantTopBar";
import { useState } from "react";
import {Link} from 'react-router-dom'
import {Toaster } from 'react-hot-toast'
import CartStatPenalite from "../../components/Assistant/Penalites/CartStatPenalite";
function PagePenalite() {
    const  [searchItem , setSearchItem] = useState('')
  return (
    <div className="penalites-wrapper">
      <Toaster position='top-right'/>
      <PageBackground />
        <AssistantTopBar searchItem={searchItem} setSearchItem={setSearchItem} />
      <div className="penalites-container">
        <div className="penalites-header">
          <h1 className="penalites-title">Gestion des pénalités</h1>
          <Link className="penalites-btn" to='/assistant/penalite/ajouter'>
            <Plus size={18} />
            Ajouter une pénalité
          </Link>
        </div>
    <div style={{
  marginBottom: '20px',
  padding: '12px 20px',
  backgroundColor: '#f3f4f6',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  display: 'inline-block',
  transition: 'transform 0.3s ease',
  cursor: 'pointer'
}}>
  <Link 
    to="/assistant/dashboard" 
    style={{
      textDecoration: 'none',
      color: '#4f46e5',
      fontWeight: 'bold',
      fontSize: '16px'
    }}
    onMouseEnter={e => e.target.style.color = '#4338ca'}
    onMouseLeave={e => e.target.style.color = '#4f46e5'}
  >
    ← Retourner à l'accueil
  </Link>
</div>

        <div className="penalites-content">
          <TableauPenalite searchItem={searchItem} />
        </div>
        <div>
          <CartStatPenalite />
        </div>
      </div>
    </div>
  );
}

export default PagePenalite;
