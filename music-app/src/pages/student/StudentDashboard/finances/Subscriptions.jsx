import { useEffect, useState } from "react";
import { RefreshCw, PauseCircle, StopCircle, CheckCircle2 } from "lucide-react";
import { usePayment } from "../../../../utils/hooks";
import { formatCurrency } from "../../../../utils/functions/formatCurrency";

const statusIcons = {
  active: <CheckCircle2 className="text-green-600 w-5 h-5" />,
  cancelled: <StopCircle className="text-red-500 w-5 h-5" />,
  paused: <PauseCircle className="text-yellow-500 w-5 h-5" />,
};

const SubscriptionsContent = () => {
  const { fetchUserPayments } = usePayment();
  const [subscriptions, setSubscriptions] = useState([]);
  const [userId, setUserId ] = useState(null);

  useEffect(() => {
    const loggedUser  = JSON.parse(localStorage.getItem('user'));
    setUserId (loggedUser._id );

  }, []);

  useEffect(() => {
    const load = async () => {
      const data = await fetchUserPayments(userId);
      const subs = data?.filter(p => p.type === "course") || [];
      setSubscriptions(subs);
    };
    load();
  }, [userId]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">📅 Mes abonnements</h2>

      {subscriptions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucun abonnement actif ou passé trouvé.</p>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <div key={sub._id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow flex justify-between items-center flex-wrap">
              <div>
                <p className="font-semibold text-gray-800 dark:text-white text-lg">Abonnement {sub.metadata?.label || "personnalisé"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Début : {new Date(sub.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Montant : {formatCurrency(sub.amount)} / {sub.metadata?.frequency || "mois"}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  Statut : {sub.status}
                </span>
                {statusIcons[sub.status] || <RefreshCw className="text-blue-500 w-5 h-5" />}
                {sub.invoiceUrl && (
                  <a
                    href={sub.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Voir la facture
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsContent;
