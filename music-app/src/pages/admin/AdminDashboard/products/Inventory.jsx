import { useEffect, useState } from "react";
import { Edit3, Save, AlertCircle } from "lucide-react";
import { useProduct, useTheme, useToast } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const InventoryManagement = () => {
  const { fetchProducts, updateStock, updateStatus } = useProduct();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchProducts();
      setProducts(res || []);
    };
    fetch();
  }, []);

  const handleEdit = (product) => {
    setEditing(product._id);
    setValues({ stock: product.stock, status: product.status });
  };

  const handleSave = async (id) => {
    try {
      if (values.stock >= 0) {
        await updateStock(id, { stock: values.stock });
        await updateStatus(id, { status: values.status });
        const refreshed = await fetchProducts();
        setProducts(refreshed);
        setEditing(null);
      }
    } catch (err) {
      console.error("Erreur de mise à jour :", err.message);
      // Optionnel : 
      toast({ variant: "destructive", title: "Erreur", description: err.message });
    }
  };
  

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
        🧮 Gestion des stocks
      </h2>

      <div className="overflow-x-auto">
        <table className={getThemeClass("w-full text-left text-sm rounded-xl bg-white shadow", "w-full text-left text-sm rounded-xl bg-gray-900 shadow", theme)}>
          <thead className={getThemeClass("text-xs uppercase text-gray-600 border-b border-gray-200", "text-xs uppercase text-gray-400 border-b border-gray-700", theme)}>
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod._id} className={getThemeClass("border-b border-gray-100", "border-b border-gray-800 text-blue-50", theme)}>
                <td className="p-3">{prod.name}</td>
                <td className="p-3">
                  {editing === prod._id ? (
                    <input
                      type="number"
                      value={values.stock}
                      onChange={(e) =>
                        setValues({ ...values, stock: e.target.value })
                      }
                      className={getThemeClass("input-style w-20", "input-style w-20 bg-gray-800 text-white border-gray-600", theme)}
                    />
                  ) : (
                    <span>{prod.stock}</span>
                  )}
                </td>
                <td className="p-3">
                  {editing === prod._id ? (
                    <select
                      value={values.status}
                      onChange={(e) =>
                        setValues({ ...values, status: e.target.value })
                      }
                      className={getThemeClass("input-style", "input-style bg-gray-800 text-white border-gray-600", theme)}
                    >
                      <option value="available">Disponible</option>
                      <option value="sold-out">Rupture</option>
                      <option value="discontinued">Retiré</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        prod.status === "available"
                          ? getThemeClass("bg-green-100 text-green-700", "bg-green-900 text-green-100", theme)
                          : prod.status === "sold-out"
                          ? getThemeClass("bg-red-100 text-red-700", "bg-red-900 text-red-100", theme)
                          : getThemeClass("bg-gray-200 text-gray-700", "bg-gray-800 text-gray-300", theme)
                      }`}
                    >
                      {prod.status}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {editing === prod._id ? (
                    <button
                      className="btn-sm btn-success"
                      onClick={() => handleSave(prod._id)}
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      className="btn-sm btn-outline text-yellow-600"
                      onClick={() => handleEdit(prod)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className={getThemeClass("flex items-center justify-center py-12 text-gray-500", "flex items-center justify-center py-12 text-gray-400", theme)}>
            <AlertCircle className="w-6 h-6 mr-2" /> Aucun produit trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
