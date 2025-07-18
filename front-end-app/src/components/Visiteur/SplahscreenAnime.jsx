import {useEffect , useState} from 'react'
import logoAnimation from '../../assets/Animation1.mp4'
import '../../styles/Visiteur/SplashscreenAnime.css'

function SplashscreenAnime({children}){

    const [ isVisible , setIsVisible ] = useState(true)

    useEffect ( () => {
        const timer = setTimeout( ()=> {
            setIsVisible(false)
        }, 5000)

        return () => clearTimeout(timer)
    } , [])

    return (
        <>
        {isVisible ? (
            <div className="splash-screen">
               <video
                    className="splash-logo"
                    src={logoAnimation}
                    autoPlay
                    muted
                    playsInline
                    
                />
            </div>
        ):( children)
        }
        </>
    )
}

export default SplashscreenAnime