import '../../styles/Visiteur/Categorie.css';

function Categories() {
  const categories = [
    { nom: "Aventure", image: "/images/categories/aventure.png" },
    { nom: "Fantastique", image: "/images/categories/fantastique.png" },
    { nom: "Romance", image: "/images/categories/romance.png" },
    { nom: "Histoire", image: "/images/categories/histoire.png" },
    { nom: "Science-fiction", image: "/images/categories/sci-fi.png" },
    { nom: "Développement", image: "/images/categories/developpement.png" },
    { nom: "Philosophie", image: "/images/categories/philosophie.png" },
  ];

  return (
    <section className="section-categories">
      <h2 className="titre-categories">Catégorie</h2>
      <div className="grille-categories">
        {categories.map((cat, index) => (
          <div className="categorie-item" key={index}>
            <img src={cat.image} alt={cat.nom} className="categorie-image" />
            <span className="categorie-nom">{cat.nom}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
