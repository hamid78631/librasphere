import {useState , useRef , useEffect} from 'react'
import axios from 'axios'
import {toast,Toaster} from 'react-hot-toast'
import HALO from 'vanta/src/vanta.halo';
import { useNavigate } from 'react-router-dom'
import FormAjoutReservations from './Formulaire/FormAjoutReservations';

function AjoutReservation(){

    const today = new Date().toISOString().split('T')[0]
    const vantaRef = useRef()
    const navigate = useNavigate()
    const [reservation , setReservation] = useState({
        utilisateur : '' ,
        livre : '',
        statut : 'en_attente', 
        date_debut : today , 
        date_fin : ''
    })
    
    useEffect(() => {
        let effect = null;
        if (vantaRef.current) {
          effect = HALO({
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

        }

        return () => {
          if (effect) effect.destroy();
        };
      }, []);

      const handleChange = async (e) => {
        const {name , value} = e.target
        setReservation((prev) =>( {...prev , [name] : value}))
      }

      const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const formData = new FormData()

            Object.entries(reservation).forEach(([key,value])=> {
                formData.append(key,value)
            })

            await axios.post('http://localhost:8000/api/reservations' , formData , {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
            ).then( (res) =>{ 
            toast.success(res.data.message)
            console.log('reservation : ',reservation)
            navigate('/admin/reservations')
            })
        }catch(err){
            toast.error(err?.response?.data?.message)
            console.error('erreur : ' ,err)
        }
      }
    return (
        <div  ref={vantaRef} className="ajout-livre-scroll">
            <Toaster position='top-right' />
            <FormAjoutReservations reservation={reservation} onChange={handleChange} onSubmit={handleSubmit} />
        </div>
    )

}
export default AjoutReservation