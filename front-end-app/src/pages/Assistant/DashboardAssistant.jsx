import AlertesEmprunts from "../../components/Assistant/AlertesEmprunts"
import AssistantQuickActions from "../../components/Assistant/AssistantQuickActions"
import AssistantTopBar from "../../components/Assistant/AssistantTopBar"
import TableauEmprunt from "../../components/Assistant/TableauEmprunt"
import TimeLineActivite from "../../components/Assistant/TimeLineActivite"
import '../../styles/Assistant/DashboardAssistant.css'
import {useState , useRef} from 'react'
import ModalUtilisateur from '../../components/Assistant/ModalUtilisateur'

function DashboardAssistant() {
    const  [searchItem , setSearchItem] = useState('')
    const empruntRef = useRef(null)
    const [voirUtilisateur ,setVoirUtilisateurs ] = useState(false)
  return (
    <div className="dashboard-assistant-container">
      <AssistantTopBar searchItem={searchItem} setSearchItem={setSearchItem}/>
      <AssistantQuickActions scrollToEmprunts={ () => {
        empruntRef.current?.scrollIntoView({ behavior: 'smooth' });
      }}
         onVoirUtilisateur = { () => setVoirUtilisateurs(true)}
      />
      <div ref={empruntRef}>
        <TableauEmprunt searchItem={searchItem}/>
      </div>
      <TimeLineActivite />
      <AlertesEmprunts />
      <ModalUtilisateur 
      visible={voirUtilisateur}
      onClose = { () =>setVoirUtilisateurs(false)}
      />
    </div>

  );
}

export default DashboardAssistant