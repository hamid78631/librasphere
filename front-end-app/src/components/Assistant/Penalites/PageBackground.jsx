import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import '../../../styles/Assistant/Penalite/PageBackground.css'
function PageBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true },
        background: { color: "#ffffff" },
        fpsLimit: 60,
        particles: {
          number: {
            value: 50,
            density: { enable: true, area: 1000 }
          },
          color: { value: "#5b21b6" }, // violet plus foncé
          shape: { type: "circle" },
          opacity: { value: 0.5},   // plus visible
          size: { value: 2.5 },
          links: {
            enable: true,
            distance: 170,
            color: "#5b21b6",         // idem pour les lignes
            opacity: 0.25,            // plus visible
            width: 0.6
          },
          move: {
            enable: true,
            speed: 0.4,
            direction: "none",
            outModes: { default: "bounce" }
          }
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
            resize: true
          },
          modes: {
            grab: {
              distance: 120,
              links: { opacity: 0.35 }
            }
          }
        },
        detectRetina: true
      }}
    />
  );
}

export default PageBackground;



// import '../../../styles/Assistant/Penalite/PageBackground.css'