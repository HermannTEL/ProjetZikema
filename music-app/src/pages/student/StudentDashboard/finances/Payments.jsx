import { useEffect, useState } from "react";
import { ReceiptText, FileCheck2, FileX2, Clock3 } from "lucide-react";
import { usePayment } from "../../../../utils/hooks";
import { formatCurrency } from "../../../../utils/functions/formatCurrency";

const statusColors = {
  succeeded: "text-green-600",
  pending: "text-yellow-600",
  failed: "text-red-600",
  refunded: "text-blue-600",
  partially_refunded: "text-blue-400"
};

const PaymentsContent = () => {
  const { fetchUserPayments } = usePayment();
  const [payments, setPayments] = useState([]);
  const [user, setUser ] = useState(null);

  useEffect(() => {
    const loggedUser  = JSON.parse(localStorage.getItem('user'));
    setUser (loggedUser );
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const data = await fetchUserPayments(user._id);
        setPayments(data || []);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">💳 Historique des paiements</h2>

      {payments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucun paiement enregistré.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <div key={p._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <div className="flex justify-between items-center flex-wrap">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">
                    {p.type === "course" && "Paiement de cours"}
                    {p.type === "product" && "Achat de produit"}
                    {p.type === "subscription" && "Abonnement"}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Montant : {formatCurrency(p.amount, p.currency, user.language === 'fr' ? 'fr-CA' : 'en-CA')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date : {new Date(p.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-semibold ${statusColors[p.status] || "text-gray-500"}`}>
                    {p.status === "succeeded" && <FileCheck2 className="inline w-4 h-4 mr-1" />} 
                    {p.status === "failed" && <FileX2 className="inline w-4 h-4 mr-1" />}
                    {p.status === "pending" && <Clock3 className="inline w-4 h-4 mr-1" />}
                    {p.status.replace("_", " ")}
                  </p>
                  {p.receiptUrl && (
                    <a href={p.receiptUrl} target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Voir le reçu
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsContent;