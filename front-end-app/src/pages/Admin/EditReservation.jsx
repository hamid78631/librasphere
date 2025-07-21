import {useEffect , useState , useRef} from 'react'
import {toast , Toaster} from 'react-hot-toast'
import { useParams , useNavigate} from 'react-router-dom'
import axios from 'axios'
import HALO from 'vanta/src/vanta.halo';
import FormEditReservation from './Formulaire/FormEditReservation'


function EditReservation(){
    const [reservations , setReservations] = useState(null)
    const vantaRef = useRef(null)
    const {id} = useParams()
    const navigate = useNavigate()

    // Charger les données de la réservation 

    useEffect( () => {
        axios.get(`http://localhost:8000/api/reservations/${id}`)
        .then( (res) =>{
            setReservations(res.data)
        })
        .catch( (err) => {
            toast.error('Une erreur est survenue lors de la récupération de la réservation!')
            console.error(('erreur'  , err))
        })
    }, [])

    //Animation vanta
    useEffect(() => {
        if (!vantaRef.current) return;
    
        const effect = HALO({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          baseColor: 0x0,
          xOffset: 0.08,
          amplitudeFactor: 3.0,
          size: 0.6,
        });
    
        return () => {
          if (effect) effect.destroy();
        };
      }, []);

      //Gestion des champs du formulaire
      const handleChange = (e) => {
        setReservations( (prev) => ({...prev , [e.target.name] : e.target.value}))
      }

      //Soumission du formulaire

      const handleSubmit = async (e) => {
        e.preventDefault()

        if(!reservations){
            toast.error('Cette réservation n\'existe pas!')
            return 
        }

        try {
            const formData = new FormData()

            const champs = ['utilisateur' , 'livre' , 'date_fin' , 'statut']

            champs.forEach( (champ) => {
                if( reservations[champ] !== undefined && reservations[champ] !== null){
                    formData.append( champ , reservations[champ])
                }
            })

            const response = await axios.post(`http://localhost:8000/api/reservations/${id}?_method=PUT` , 
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            )
            toast.success('Réservations modifié avec succès')
            navigate('/admin/reservations')
        }catch (error) {
            const message = error.response?.data?.message || error.message;
            console.error("❌ Erreur lors de la modification :", message);
            toast.error("Erreur lors de la modification !");
  }

      }
    return(
        <div className="edit-livre-global">
      <div ref={vantaRef} className="edit-livre-bg" />
      <div className="edit-livre-scroll">
        <FormEditReservation reservation={reservations} onChange={handleChange} onSubmit={handleSubmit} />
      </div>
    </div>
    )
}

export default EditReservation 