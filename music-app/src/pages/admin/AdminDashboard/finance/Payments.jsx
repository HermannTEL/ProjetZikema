import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { usePayment, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const PaymentsManagement = () => {
  const { fetchAllPayments } = usePayment();
  const { theme } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchAllPayments();
      setPayments(res || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold flex items-center gap-2 text-gray-800", "text-3xl font-bold flex items-center gap-2 text-white", theme)}>
        <CreditCard className="text-purple-500" /> Paiements reçus
      </h2>

      {loading ? (
        <div className={getThemeClass("flex justify-center py-10 text-gray-500", "flex justify-center py-10 text-gray-300", theme)}>
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Chargement des paiements...
        </div>
      ) : (
        <div className={getThemeClass("overflow-x-auto bg-white shadow rounded-xl", "overflow-x-auto bg-gray-900 shadow rounded-xl", theme)}>
          <table className="w-full text-sm text-left">
            <thead className={getThemeClass("text-xs uppercase text-gray-600 border-b", "text-xs uppercase text-gray-400 border-b", theme)}>
              <tr>
                <th className="p-3">Utilisateur</th>
                <th className="p-3">Type</th>
                <th className="p-3">Montant</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className={getThemeClass("border-b", "border-b dark:border-gray-800 text-blue-50", theme)}>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3 capitalize">{p.type}</td>
                  <td className="p-3 text-green-600 font-medium">
                    {p.amount} {p.currency}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        p.status === "succeeded"
                          ? getThemeClass("bg-green-100 text-green-700", "bg-green-900 text-green-100", theme)
                          : p.status === "pending"
                          ? getThemeClass("bg-yellow-100 text-yellow-700", "bg-yellow-900 text-yellow-100", theme)
                          : p.status === "failed"
                          ? getThemeClass("bg-red-100 text-red-700", "bg-red-900 text-red-100", theme)
                          : getThemeClass("bg-blue-100 text-blue-700", "bg-blue-900 text-blue-100", theme)
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsManagement;
