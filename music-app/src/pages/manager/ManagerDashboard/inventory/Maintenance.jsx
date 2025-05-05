import { useEffect, useState } from "react";
import { Wrench, AlertTriangle, CalendarDays, Box } from "lucide-react";
import { useProduct, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const InventoryMaintenanceManager = () => {
  const { fetchProducts } = useProduct();
  const { theme } = useTheme();
  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const products = await fetchProducts();
      const filtered = products.filter(
        (p) =>
          p.status === "discontinued" || p.condition === "fair" || p.condition === "poor"
      );
      setMaintenanceItems(filtered);
    };
    fetch();
  }, []);

  const filtered = maintenanceItems.filter((item) =>
    !filter || (item.condition || "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        🛠 Produits en maintenance / état critique
      </h2>

      <input
        className="input-style w-full max-w-md"
        placeholder="Filtrer par état (fair, poor...)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">Aucun produit à signaler.</p>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              className={getThemeClass(
                "bg-white text-gray-800",
                "bg-gray-800 text-white",
                theme
              ) + " p-5 rounded-xl shadow flex flex-col gap-2"}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                  <Wrench className="inline w-5 h-5 mr-2" />
                  {item.name}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.condition === "poor"
                      ? "bg-red-100 text-red-800"
                      : item.condition === "fair"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.condition}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                <Box className="inline w-4 h-4 mr-1" /> Catégorie : {item.category}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                <CalendarDays className="inline w-4 h-4 mr-1" /> Ajouté le : {" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              {item.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <AlertTriangle className="inline w-4 h-4 mr-1" /> {item.description}
                </p>
              )}
              {item.mainImage && (
                <img
                  src={item.mainImage}
                  alt={item.name}
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

export default InventoryMaintenanceManager;
