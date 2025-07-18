// VitrineLivre.jsx
import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Autoplay,
  Mousewheel,
  EffectFade,
  Pagination
} from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "../../styles/Visiteur/VitrineLivre.css";

const images = [
  { src: "/images/Alchimiste.png", titre: "L'Alchimiste" },
  { src: "/images/Harrypoter.png", titre: "Harry Potter" },
  { src: "/images/S2.png", titre: "Saison 2" },
  { src: "/images/Teneris.png", titre: "Teneris" },
  { src: "/images/vent.png", titre: "Le Nom du Vent" },
  { src: "/images/David.png", titre: "Can't Hurt Me - David Goggins" },
  { src: "/images/Haryy.png", titre: "Harry Potter - Tome 2" },
  { src: "/images/Dragon.png", titre: "Le Vol du Dragon" },
  { src: "/images/echecs.jpg", titre: "Garry Kasparov - How life limitates chess" },
  { src: "/images/desert.png", titre: "Dune - Frank Herbert" },
  { src: "/images/verre.png", titre: "Le chateau de verre - Halls" },
  { src: "/images/Mamba.png", titre: "The Mamba mentality - Kobe Bryant" },
];

export default function VitrineLivre() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cursor = document.querySelector(".aura-cursor");
      if (cursor) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      }
    };
    document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="vitrine-wrapper">
      <div className="custom-nav prev"><ChevronLeft size={28} /></div>
      <div className="custom-nav next"><ChevronRight size={28} /></div>

      <div className="vitrine-container agrandie">
        <Swiper
          modules={[Navigation, Autoplay, Mousewheel, EffectFade, Pagination]}
          navigation={{ nextEl: ".next", prevEl: ".prev" }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          mousewheel
          loop
          effect="fade"
          fadeEffect={{ crossFade: true }}
           pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="vitrine-slide-wrapper">
                <img src={img.src} alt={`slide-${idx}`} className="vitrine-image" />
                <div className="image-title-overlay">{img.titre}</div>
                <div className="badge-disponible">Disponible</div>
                <div className="badge-bottom">À lire absolument</div>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
