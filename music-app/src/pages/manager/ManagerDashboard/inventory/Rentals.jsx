import { useEffect, useState } from "react";
import {
  Tag,
  CalendarClock,
  TimerReset,
  Box,
  ArrowRightLeft,
} from "lucide-react";
import { useProduct, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const InventoryRentalsManager = () => {
  const { getRentableProducts } = useProduct();
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const res = await getRentableProducts();
      setProducts(res || []);
    };
    fetch();
  }, []);

  const filtered = products.filter((p) =>
    !filter || p.category?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        🎸 Locations d'instruments
      </h2>

      <input
        className="input-style w-full max-w-md"
        placeholder="Filtrer par catégorie (piano, guitare...)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>
            Aucun produit louable trouvé.
          </p>
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
              <h3 className={getThemeClass("text-lg font-bold text-gray-800", "text-lg font-bold text-white", theme)}>
                {product.name}
              </h3>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                <Tag className="inline w-4 h-4 mr-1" /> {product.category} - {product.brand || "Sans marque"}
              </p>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                <Box className="inline w-4 h-4 mr-1" /> Stock : {product.stock}
              </p>
              <div className={getThemeClass("text-sm text-gray-500 space-y-1", "text-sm text-gray-300 space-y-1", theme)}>
                <p>
                  <CalendarClock className="inline w-4 h-4 mr-1" /> Journée : {product.rentalPrice?.daily || "N/A"} €
                </p>
                <p>
                  <TimerReset className="inline w-4 h-4 mr-1" /> Semaine : {product.rentalPrice?.weekly || "N/A"} €
                </p>
                <p>
                  <ArrowRightLeft className="inline w-4 h-4 mr-1" /> Mois : {product.rentalPrice?.monthly || "N/A"} €
                </p>
              </div>
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

export default InventoryRentalsManager;
