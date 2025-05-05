import { useEffect, useState } from "react";
import { FileText, FileCheck2, FileX2 } from "lucide-react";
import { usePayment } from "../../../../utils/hooks";
import { formatCurrency } from "../../../../utils/functions/formatCurrency";

const InvoicesContent = () => {
  const { fetchUserPayments } = usePayment();
  const [invoices, setInvoices] = useState([]);
  const [user, setUser ] = useState(null);

  useEffect(() => {
    const loggedUser  = JSON.parse(localStorage.getItem('user'));
    setUser (loggedUser );
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchUserPayments(user._id);
      const valid = data?.filter(p => p.invoiceUrl || p.invoiceNumber);
      setInvoices(valid || []);
    };
    fetch();
  }, [user]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">🧾 Mes factures</h2>

      {invoices.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucune facture disponible.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div key={inv._id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex justify-between items-center flex-wrap">
              <div className="flex flex-col">
                <p className="font-semibold text-gray-800 dark:text-white">Facture #{inv.invoiceNumber || "N/A"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(inv.createdAt).toLocaleDateString()} — {formatCurrency(inv.amount)} {inv.currency}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Type : {inv.type}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <p className={`text-sm font-semibold ${
                  inv.status === "succeeded" ? "text-green-600" : inv.status === "failed" ? "text-red-500" : "text-yellow-600"
                }`}>
                  {inv.status === "succeeded" && <FileCheck2 className="inline w-4 h-4 mr-1" />}
                  {inv.status === "failed" && <FileX2 className="inline w-4 h-4 mr-1" />}
                  {inv.status.replace("_", " ")}
                </p>

                {inv.invoiceUrl && (
                  <a
                    href={inv.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" /> Voir la facture
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

export default InvoicesContent;
