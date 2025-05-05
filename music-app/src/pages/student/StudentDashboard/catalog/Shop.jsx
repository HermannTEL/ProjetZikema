import { useEffect, useState } from "react";
import { useCart, useProduct, useTheme } from "../../../../utils/hooks";

const ShopContent = () => {
  const { fetchProducts } = useProduct();
  const { addItem } = useCart();
  const { theme } = useTheme();

  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ category: "", rentable: "" });

  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    load();
  }, []);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p =>
    (!filter.category || p.category === filter.category) &&
    (filter.rentable === ""
      || (filter.rentable === "yes" && p.isRentable)
      || (filter.rentable === "no" && !p.isRentable))
  );

  const handleAddToCart = async (productId) => {
    await addItem({ itemType: "Product", itemId: productId });
  };

  return (
    <div className={`p-6 max-w-7xl mx-auto ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🛍️ Boutique musicale</h2>

      {/* Filtres */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <select onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} className={`p-2 rounded border ${theme === "dark" ? "text-cyan-50 bg-gray-900" : "text-gray-900 bg-blue-50"}`}>
          <option value="">📚 Toutes les catégories</option>
          {categories.map((c, index) => <option key={index}>{c}</option>)}
        </select>

        <select onChange={e => setFilter(f => ({ ...f, rentable: e.target.value }))} className={`p-2 rounded border ${theme === "dark" ? "text-cyan-50 bg-gray-900" : "text-gray-900 bg-blue-50"}`}>
          <option value="">🎵 Vente & Location</option>
          <option value="yes">📦 Louables uniquement</option>
          <option value="no">🛒 Vente uniquement</option>
        </select>
      </div>

      {/* Liste des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product._id} className={`shadow-md rounded-xl overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <img
              src={product.mainImage || "/img/product-default.jpg"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{product.name}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{product.category}</p>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} line-clamp-2`}>{product.description}</p>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div>
                  <span className={`font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    {product.price.toFixed (2)} €
                  </span>
                  {product.isRentable && (
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-yellow-700 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                      Louable
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="ml-2 text-xs text-red-600 font-semibold">Épuisé</span>
                  )}
                </div>

                <button
                  disabled={product.stock === 0}
                  onClick={() => handleAddToCart(product._id)}
                  className={`text-xs px-3 py-1 rounded ${product.stock === 0 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className={`text-gray-500 mt-6 ${theme === 'dark' ? 'dark:text-gray-400' : ''}`}>Aucun produit ne correspond à votre sélection.</p>
      )}
    </div>
  );
};

export default ShopContent;