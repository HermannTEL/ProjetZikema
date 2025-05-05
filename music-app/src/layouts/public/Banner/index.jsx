import "./index.css";


const Banner = () => {
    return (
        <div className="Banner-contener">
            <div className="banner">
                <h1>Zikema</h1>
                <p>Le nouveau site de vente en ligne pour les meilleurs produits de luxe</p>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Rechercher un produit" />
                <button>Rechercher</button>
            </div>
         

        </div>
    );
};

export default Banner;