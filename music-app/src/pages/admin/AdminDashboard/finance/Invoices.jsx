import { useEffect, useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { usePayment, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const InvoicesManagement = () => {
  const { fetchAllPayments } = usePayment();
  const { theme } = useTheme();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchAllPayments();
      const withInvoices = data.filter((p) => p.invoiceUrl);
      setInvoices(withInvoices);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme) + " flex items-center gap-2"}>
        <FileText className="text-indigo-500" /> Factures générées
      </h2>

      {loading ? (
        <div className={getThemeClass("flex justify-center py-10 text-gray-500", "flex justify-center py-10 text-gray-300", theme)}>
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Chargement des factures...
        </div>
      ) : invoices.length === 0 ? (
        <div className={getThemeClass("text-center text-gray-500", "text-center text-gray-400", theme)}>
          Aucune facture disponible.
        </div>
      ) : (
        <div className={getThemeClass("overflow-x-auto bg-white shadow rounded-xl", "overflow-x-auto bg-gray-900 shadow rounded-xl", theme)}>
          <table className="w-full text-sm text-left">
            <thead className={getThemeClass("text-xs uppercase text-gray-600 border-b", "text-xs uppercase text-gray-400 border-b", theme)}>
              <tr>
                <th className="p-3">Numéro</th>
                <th className="p-3">Client</th>
                <th className="p-3">Montant</th>
                <th className="p-3">Lien</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className={getThemeClass("border-b", "border-b dark:border-gray-800 text-blue-50", theme)}>
                  <td className="p-3">{inv.invoiceNumber || "N/A"}</td>
                  <td className="p-3">{inv.email}</td>
                  <td className="p-3 text-green-600 font-semibold">{inv.amount} €</td>
                  <td className="p-3">
                    <a
                      href={inv.invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline inline-flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" /> Télécharger
                    </a>
                  </td>
                  <td className="p-3">{new Date(inv.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoicesManagement;
