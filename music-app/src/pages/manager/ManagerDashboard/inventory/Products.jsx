import { useEffect, useState } from "react";
import { Box, Layers3, Tag, PackageCheck } from "lucide-react";
import { useProduct, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const InventoryProductsManager = () => {
  const { fetchProducts } = useProduct();
  const { theme } = useTheme();

  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ category: "", brand: "" });

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchProducts();
      setProducts(res || []);
    };
    fetch();
  }, []);

  const filtered = products.filter(p => {
    return (
      (!filter.category || p.category === filter.category) &&
      (!filter.brand || (p.brand || "").toLowerCase().includes(filter.brand.toLowerCase()))
    );
  });

  const categories = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>📦 Produits et instruments</h2>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="input-style"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">Catégorie</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="input-style"
          placeholder="Marque"
          value={filter.brand}
          onChange={(e) => setFilter({ ...filter, brand: e.target.value })}
        />
      </div>

      {/* Affichage produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>Aucun produit trouvé.</p>
        ) : (
          filtered.map((product) => (
            <div
              key={product._id}
              className={getThemeClass(
                "bg-white p-5 rounded-xl shadow flex flex-col gap-2",
                "bg-gray-800 p-5 rounded-xl shadow flex flex-col gap-2",
                theme
              )}
            >
              <div className="flex justify-between items-start">
                <h3 className={getThemeClass("text-lg font-semibold text-gray-800", "text-lg font-semibold text-white", theme)}>{product.name}</h3>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    product.status === "available"
                      ? "bg-green-100 text-green-800"
                      : product.status === "sold-out"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}> 
                <Tag className="inline w-4 h-4 mr-1" /> {product.brand || "Marque inconnue"}
              </p>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}> 
                <Layers3 className="inline w-4 h-4 mr-1" /> Catégorie : {product.category}
              </p>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}> 
                <PackageCheck className="inline w-4 h-4 mr-1" /> Stock : {product.stock}
              </p>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>💶 {product.price} €</p>
              {product.mainImage && (
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="rounded-md mt-2 max-h-40 object-cover"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryProductsManager;
