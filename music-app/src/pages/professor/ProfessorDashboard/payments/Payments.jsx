import { useEffect, useState } from "react";
import { CreditCard, ReceiptText, CalendarDays, BadgeCheck } from "lucide-react";
import { format } from "date-fns";
import { usePayment } from "../../../../utils/hooks";

const ProfessorPaymentsContent = () => {
  const { fetchUserPayments } = usePayment();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const profId = JSON.parse(localStorage.getItem("user"))._id;
    fetchUserPayments(profId).then(setPayments);
  }, []);

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">💰 Paiements reçus</h2>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex justify-between">
        <div className="text-xl font-semibold text-gray-800 dark:text-white">Total reçu :</div>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{total.toFixed(2)} €</div>
      </div>

      <div className="space-y-4">
        {payments.length === 0 && (
          <p className="text-gray-500 dark:text-gray-300">Aucun paiement trouvé.</p>
        )}

        {payments.map((p, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-1">
            <div className="flex justify-between items-center">
              <div className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {p.type.toUpperCase()}
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  p.status === "succeeded" ? "bg-green-100 text-green-700" :
                  p.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}
              >
                {p.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 text-sm text-gray-600 dark:text-gray-300 mt-2 gap-2">
              <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {format(new Date(p.createdAt), "dd MMM yyyy")}</p>
              <p className="flex items-center gap-2"><ReceiptText className="w-4 h-4" /> {p.amount.toFixed(2)} €</p>
              <p className="flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> {p.paymentMethod?.brand || "Carte inconnue"} ****{p.paymentMethod?.last4}</p>
              {p.invoiceUrl && (
                <p>
                  <a href={p.invoiceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                    Voir la facture
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessorPaymentsContent;
