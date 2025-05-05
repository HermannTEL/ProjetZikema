import { useEffect, useState } from "react";
import { BadgeDollarSign, Save, PencilLine } from "lucide-react";
import { useProduct, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const RentalManagement = () => {
  const { getRentableProducts, updateRentalPrices } = useProduct();
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [prices, setPrices] = useState({ daily: "", weekly: "", monthly: "" });

  useEffect(() => {
    const fetch = async () => {
      const res = await getRentableProducts();
      setProducts(res || []);
    };
    fetch();
  }, []);

  const handleEdit = (prod) => {
    setEditingId(prod._id);
    setPrices({ ...prod.rentalPrice });
  };

  const handleSave = async (id) => {
    await updateRentalPrices(id, prices);
    const refreshed = await getRentableProducts();
    setProducts(refreshed);
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme) + " flex items-center gap-2"}>
        <BadgeDollarSign className="w-6 h-6 text-green-500" /> Gestion des locations
      </h2>

      <div className="overflow-x-auto">
        <table className={getThemeClass("w-full text-sm text-left bg-white rounded-xl shadow", "w-full text-sm text-left bg-gray-900 rounded-xl shadow", theme)}>
          <thead className={getThemeClass("text-xs uppercase text-gray-600 border-b border-gray-300", "text-xs uppercase text-gray-400 border-b border-gray-700", theme)}>
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3">Par jour</th>
              <th className="p-3">Par semaine</th>
              <th className="p-3">Par mois</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr
                key={prod._id}
                className={getThemeClass("border-b border-gray-100", "border-b border-gray-800", theme)}
              >
                <td className="p-3">{prod.name}</td>
                <td className="p-3">{prod.category}</td>
                {editingId === prod._id ? (
                  <>
                    <td className="p-3">
                      <input
                        type="number"
                        className={getThemeClass("input-style w-24", "input-style w-24 bg-gray-800 text-white border-gray-600", theme)}
                        value={prices.daily}
                        onChange={(e) =>
                          setPrices({ ...prices, daily: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        className={getThemeClass("input-style w-24", "input-style w-24 bg-gray-800 text-white border-gray-600", theme)}
                        value={prices.weekly}
                        onChange={(e) =>
                          setPrices({ ...prices, weekly: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        className={getThemeClass("input-style w-24", "input-style w-24 bg-gray-800 text-white border-gray-600", theme)}
                        value={prices.monthly}
                        onChange={(e) =>
                          setPrices({ ...prices, monthly: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleSave(prod._id)}
                        className="btn-sm btn-success"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{prod.rentalPrice?.daily ?? "-"}</td>
                    <td className="p-3">{prod.rentalPrice?.weekly ?? "-"}</td>
                    <td className="p-3">{prod.rentalPrice?.monthly ?? "-"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="btn-sm btn-outline text-yellow-600"
                      >
                        <PencilLine className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className={getThemeClass("text-center text-gray-500 mt-10", "text-center text-gray-400 mt-10", theme)}>
            Aucun produit disponible à la location.
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalManagement;
