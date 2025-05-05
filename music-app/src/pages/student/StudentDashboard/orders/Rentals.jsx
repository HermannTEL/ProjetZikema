import { useEffect, useState } from "react";
import { CalendarCheck, TimerReset, AlarmClock } from "lucide-react";
import { useOrder } from "../../../../utils/hooks";
import { formatCurrency } from "../../../../utils/functions/formatCurrency";

const RentalsContent = () => {
  const { fetchUserOrders } = useOrder();
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchUserOrders();
      const filtered = data?.flatMap(order =>
        order.products?.filter(p => p.product?.isRentable).map(p => ({
          ...p,
          orderId: order._id,
          orderDate: order.createdAt,
        }))
      ) || [];
      setRentals(filtered);
    };
    load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">🎻 Locations en cours / passées</h2>

      {rentals.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucune location enregistrée pour l’instant.</p>
      ) : (
        <div className="space-y-6">
          {rentals.map((item, i) => {
            const rental = item.product?.rentalPrice;
            const condition = item.product?.condition;
            const duration = rental?.monthly
              ? "Mensuel"
              : rental?.weekly
              ? "Hebdo"
              : "Journalier";
            const price =
              rental?.monthly || rental?.weekly || rental?.daily || 0;

            return (
              <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product?.mainImage || "/placeholder.png"}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{item.product?.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">État : {condition}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quantité : {item.quantity}</p>
                    </div>
                  </div>

                  <div className="text-sm text-right text-gray-600 dark:text-gray-300 space-y-1">
                    <p className="flex items-center gap-1">
                      <CalendarCheck className="w-4 h-4" />
                      Commandé le : {new Date(item.orderDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-1">
                      <TimerReset className="w-4 h-4" />
                      {duration} — {formatCurrency(price)}
                    </p>
                    <p className="flex items-center gap-1 italic text-blue-500">
                      <AlarmClock className="w-4 h-4" />
                      Retour prévu : à définir par gestion
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RentalsContent;
