import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { useOrder, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const OrdersManagement = () => {
  const { fetchAllOrders } = useOrder();
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchAllOrders();
      setOrders(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme) + " flex items-center gap-2"}>
        <FileText className="text-blue-500" /> Commandes
      </h2>

      {loading ? (
        <div className={getThemeClass("flex justify-center py-10 text-gray-500", "flex justify-center py-10 text-gray-300", theme)}>
          <Loader2 className="animate-spin w-6 h-6 mr-2" /> Chargement des commandes...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className={getThemeClass("w-full text-sm text-left bg-white", "w-full text-sm text-left bg-gray-900", theme)}>
            <thead className={getThemeClass("text-xs uppercase text-gray-600 border-b", "text-xs uppercase text-gray-400 border-b", theme)}>
              <tr>
                <th className="p-3">Utilisateur</th>
                <th className="p-3">Montant</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className={getThemeClass("border-b", "border-b dark:border-gray-700 text-blue-50", theme)}>
                  <td className="p-3">{order.user?.email || "N/A"}</td>
                  <td className="p-3 font-medium text-green-600">{order.totalAmount} €</td>
                  <td className="p-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        order.paymentStatus === "payé"
                          ? getThemeClass("bg-green-100 text-green-700", "bg-green-900 text-green-100", theme)
                          : order.paymentStatus === "en attente"
                          ? getThemeClass("bg-yellow-100 text-yellow-700", "bg-yellow-900 text-yellow-100", theme)
                          : getThemeClass("bg-red-100 text-red-700", "bg-red-900 text-red-100", theme)
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
