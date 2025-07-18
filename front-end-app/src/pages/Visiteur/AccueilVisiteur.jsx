import { useState } from "react";
import NavbarVisiteur from "../../components/Visiteur/NavbarVisiteur";
import SearchBar from "../../components/Visiteur/SearchBar";
import SplashscreenAnime from "../../components/Visiteur/SplahscreenAnime";
import '../../styles/Visiteur/AccueilVisiteur.css';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import ProfilConnecte from "../../components/Visiteur/ProfilConnecte";
import VitrineLivres from "../../components/Visiteur/VitrineLivre";
import VitrineDroite from "../../components/Visiteur/VitrineDroite";
import CoupsDeCoeur from "../../components/Visiteur/CoupsDeCoeur";
import DernieresSorties from "../../components/Visiteur/DerniereSorties";
import Categories from "../../components/Visiteur/categories";
function AccueilVisiteur() {
  const [searchItem, setSearchItem] = useState('');

  return (
    <div>
      <SplashscreenAnime>
        <div className="main-content">
          <ProfilConnecte position="top-right" />
          <NavbarVisiteur />
          <SearchBar searchItem={searchItem} setSearchItem={setSearchItem} />
          <h1 className="slogan-visiteur">
            Chaque page est un nouveau départ
            <Star size={25} color="#3F0071" strokeWidth={2.5} />
          </h1>
          <br /><br />
          <div className="accueil-container">
    <div className="vitrine-livre-container">
      <VitrineLivres />
    </div>

    <div className="vitrine-droite-wrapper">
      <VitrineDroite />
    </div>
  </div>
    <CoupsDeCoeur />
    <DernieresSorties />
    <Categories />
        </div>
      </SplashscreenAnime>
    </div>
  );
}

export default AccueilVisiteur;
