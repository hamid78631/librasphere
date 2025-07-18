import { PlusCircle , RefreshCw , AlertCircle , Users} from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import '../../styles/Assistant/AssistantQuickActions.css'
import { motion } from 'framer-motion';


function AssistantQuickActions({ scrollToEmprunts , onVoirUtilisateur}){
    const navigate = useNavigate()
    const actions = [
        {
            title : 'Ajouter un emprunt',
            icon : <PlusCircle size={28} />,
            color : 'violet',
            background : '/assets/violetBack.jpg',
            onClick :  () => navigate('/assistant/emprunts/ajouter')
        },
        {
            title : 'Retourner un livre',
            icon : <RefreshCw size={28} />,
            color : 'blue',
            background : '/assets/blueBack.jpg',
            onClick :  scrollToEmprunts
        },{
            title : 'Créer une pénalité',
            icon : <AlertCircle size={28} />,
            color : 'red',
            background : '/assets/redBack.jpg',
            onClick :  () => navigate('/assistant/penalite')
        },{
             title : 'Voir un utilisateur',
            icon : <Users size={28} />,
            color : 'green',
            background : '/assets/greenBack.jpg',
            onClick :  onVoirUtilisateur
        }
    ]
    return ( 
        <motion.div
  className="assistant-actions-grid"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
            {actions.map( (action , index) => ( 
                <div key={index}
                className={`assistant-action-card card-${action.color}` }
                onClick={action.onClick}
                style={{
                    backgroundImage : `url(${action.background})`
                }}>
                    <div className='assistant-action-icon' >{action.icon} </div>
                    <div className='assistant-action-title'>{action.title} </div>
                </div>
            ))}
        </motion.div>
    )
}

export default AssistantQuickActions