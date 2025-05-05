import { useEffect, useState } from "react";
import { BarChart2, FileDown, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { usePayment, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const FinanceReports = () => {
  const { fetchPaymentStatistics, generatePaymentReports } = usePayment();
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetchPaymentStatistics(period);
        if (response?.timeSeriesData) {
          setStats(processPaymentData(response));
        } else {
          console.error("Format de réponse incorrect:", response);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  const processPaymentData = (data) => {
    const { timeSeriesData, overallStats } = data;

    let totalAmount = 0;
    let totalPayments = 0;
    let activeSubscriptions = 0;

    overallStats.forEach(stat => {
      totalAmount += stat.totalAmount - stat.refundedAmount;
      totalPayments += stat.count;
      if (stat._id === "subscription") activeSubscriptions = stat.count;
    });

    const monthlyTotals = timeSeriesData.map(entry => ({
      month: formatPeriodLabel(entry.name, period),
      totalAmount: entry.netAmount,
      count: entry.totalCount
    }));

    return { totalAmount, totalPayments, activeSubscriptions, monthlyTotals };
  };

  const formatPeriodLabel = (label, type) => {
    if (type === "daily") return label.substring(5).replace("-", "/");
    if (type === "weekly") return `S.${label.split("W")[1]}`;
    if (type === "monthly") {
      const [year, month] = label.split("-");
      return `${month}/${year}`;
    }
    return label;
  };

  const formatChartData = () => {
    return stats?.monthlyTotals?.map(entry => ({
      mois: entry.month,
      montant: entry.totalAmount,
    })) || [];
  };

  const handleExport = async () => {
    try {
      const blob = await generatePaymentReports({ format: "pdf", period });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rapport-financier-${period}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors de l'export du rapport:", error);
      alert("Échec de l'exportation du rapport");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme) + " flex items-center gap-2"}>
          <BarChart2 className="text-emerald-500" /> Rapports financiers
        </h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className={getThemeClass(
                "border border-gray-300 rounded-md p-2 text-sm",
                "border border-gray-700 bg-gray-800 text-white rounded-md p-2 text-sm",
                theme
              )}
            >
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center gap-2 text-sm transition-colors"
          >
            <FileDown className="w-4 h-4" /> Exporter PDF
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : stats ? (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={getThemeClass("bg-white p-6 rounded-xl shadow", "bg-gray-900 p-6 rounded-xl shadow", theme)}>
              <h4 className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-400", theme)}>Revenus totaux</h4>
              <p className="text-2xl font-bold text-green-600">{stats.totalAmount.toLocaleString()} €</p>
            </div>
            <div className={getThemeClass("bg-white p-6 rounded-xl shadow", "bg-gray-900 p-6 rounded-xl shadow", theme)}>
              <h4 className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-400", theme)}>Nombre de paiements</h4>
              <p className="text-2xl font-bold text-blue-600">{stats.totalPayments.toLocaleString()}</p>
            </div>
            <div className={getThemeClass("bg-white p-6 rounded-xl shadow", "bg-gray-900 p-6 rounded-xl shadow", theme)}>
              <h4 className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-400", theme)}>Abonnements actifs</h4>
              <p className="text-2xl font-bold text-purple-600">{stats.activeSubscriptions.toLocaleString()}</p>
            </div>
          </div>

          {/* Graphique */}
          <div className={getThemeClass("bg-white p-6 rounded-xl shadow", "bg-gray-900 p-6 rounded-xl shadow", theme)}>
            <h3 className={getThemeClass("text-lg font-semibold mb-4 text-gray-700", "text-lg font-semibold mb-4 text-gray-300", theme)}>
              Évolution des revenus ({period === 'daily' ? 'quotidienne' : period === 'weekly' ? 'hebdomadaire' : period === 'monthly' ? 'mensuelle' : 'annuelle'})
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatChartData()}>
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
                  <Bar dataKey="montant" fill="#4ade80" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className={getThemeClass("bg-white p-6 rounded-xl shadow flex justify-center items-center h-64", "bg-gray-900 p-6 rounded-xl shadow flex justify-center items-center h-64", theme)}>
          <p className={getThemeClass("text-gray-500", "text-gray-400", theme)}>
            Impossible de charger les statistiques
          </p>
        </div>
      )}
    </div>
  );
};

export default FinanceReports;
