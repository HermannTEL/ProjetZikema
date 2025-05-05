import { useEffect, useState } from "react";
import { PackageCheck, XCircle, Clock, Loader } from "lucide-react";
import { useOrder } from "../../../../utils/hooks";
import { formatCurrency } from "../../../../utils/functions/formatCurrency";

const statusIcons = {
  "payé": <PackageCheck className="w-4 h-4 text-green-600 inline" />,
  "en attente": <Clock className="w-4 h-4 text-yellow-500 inline" />,
  "échoué": <XCircle className="w-4 h-4 text-red-600 inline" />,
};

const PurchasesContent = () => {
  const { fetchUserOrders } = useOrder();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchUserOrders();
      setOrders(data || []);
    };
    load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">🛒 Mes achats</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucun achat effectué pour le moment.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-3">
              <div className="flex justify-between">
                <p className="font-semibold text-gray-800 dark:text-white">
                  Commande #{order._id.slice(-6)} — {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Statut : {statusIcons[order.paymentStatus]}{" "}
                  <span className="capitalize">{order.paymentStatus}</span>
                </p>
              </div>

              <ul className="space-y-2">
                {order.products.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 border-t pt-2">
                    <img
                      src={item.product?.mainImage || "/placeholder.png"}
                      alt={item.product?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">{item.product?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantité : {item.quantity}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-gray-300">
                      {formatCurrency(item.product?.price || 0)}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="text-right font-semibold text-gray-700 dark:text-gray-200 mt-2">
                Total : {formatCurrency(order.totalAmount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchasesContent;
