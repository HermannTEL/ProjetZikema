import { useEffect, useState } from "react";
import {
  PackageSearch,
  Plus,
  Edit,
  Trash2,
  BadgeDollarSign,
  ShoppingBag,
} from "lucide-react";
import { useProduct, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";
import ProductProfileEditor from "../../../Profile/ProductProfileEditor";

const AllProducts = () => {
  const { fetchProducts, deleteProduct } = useProduct();
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchProducts();
      setProducts(res || []);
    };
    fetch();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleDisplay = (product) => {
    setSelectedProduct(product);
    setDisplay(true);
  }

  return (
    <>
      {display ? (
        <ProductProfileEditor
          productId={selectedProduct?._id}
          onClose={() => {
            setDisplay(false);
            setSelectedProduct(null);
            fetchProducts().then(res => setProducts(res || []));
          }}
          mode={selectedProduct ? "edit" : "create"}
        />
      ) : (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme) + " flex items-center gap-2"}>
            <ShoppingBag className="w-6 h-6 text-pink-500" /> Catalogue des produits
          </h2>
    
          <div className="flex gap-4 items-center">
            <input
              className={getThemeClass("input-style w-full max-w-md", "input-style w-full max-w-md bg-gray-800 text-white border-gray-600", theme)}
              placeholder="🔍 Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn-primary">
              <Plus className="w-4 h-4 mr-1" /> Nouveau produit
            </button>
          </div>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((prod) => (
              <div
                key={prod._id}
                className={getThemeClass("bg-white p-4 rounded-2xl shadow space-y-2", "bg-gray-800 p-4 rounded-2xl shadow space-y-2", theme)}
              >
                <h3 className={getThemeClass("text-lg font-bold text-gray-800", "text-lg font-bold text-white", theme) + " flex items-center gap-2"}>
                  <PackageSearch className="w-5 h-5 text-indigo-500" />
                  {prod.name}
                </h3>
                <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                  Catégorie : {prod.category} • {prod.brand}
                </p>
                <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                  💰 {prod.price} € • Stock : {prod.stock}
                </p>
                <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                  {prod.isRentable && (
                    <>
                      <BadgeDollarSign className="inline w-4 h-4 text-green-500" /> Disponible à la location
                    </>
                  )}
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      prod.status === "available"
                        ? getThemeClass("bg-green-100 text-green-700", "bg-green-900 text-green-100", theme)
                        : prod.status === "sold-out"
                        ? getThemeClass("bg-red-100 text-red-700", "bg-red-900 text-red-100", theme)
                        : getThemeClass("bg-gray-200 text-gray-700", "bg-gray-800 text-gray-300", theme)
                    }`}
                  >
                    {prod.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="btn-sm btn-outline text-yellow-500"
                      onClick={()=>handleDisplay(prod)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="btn-sm btn-danger text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AllProducts;
