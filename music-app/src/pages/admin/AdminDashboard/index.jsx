import { useEffect, useState } from "react";
import { Users, Music2, ShoppingCart, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useCourse, usePayment, useProduct, useTheme, useUser  } from "../../../utils/hooks";
import { getThemeClass } from "../../../utils/functions";

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { fetchCourses } = useCourse();
  const { userList, fetchAllUsers } = useUser ();
  const { fetchProducts } = useProduct();
  const { fetchPaymentStatistics } = usePayment();

  const [counts, setCounts] = useState({
    users: 0,
    courses: 0,
    products: 0,
    revenue: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, courses, products, paymentsResponse] = await Promise.all([
          fetchAllUsers(),
          fetchCourses(),
          fetchProducts(),
          fetchPaymentStatistics(period)
        ]);
        // console.log("Données récupérées:", { users, courses, products, paymentsResponse });

        // // Vérification des données récupérées
        // if (!users || !courses || !products || !paymentsResponse) {
        //   throw new Error("Erreur lors de la récupération des données");
        // }

        const payments = paymentsResponse || {};
        const totalRevenue = payments.timeSeriesData?.reduce((acc, el) => acc + (el.totalAmount || 0), 0) || 0;

        setCounts({
          users: userList?.length || 0,
          courses: courses?.length || 0,
          products: products?.length || 0,
          revenue: totalRevenue,
        });

        if (payments.timeSeriesData?.length > 0) {
          setChartData(payments.timeSeriesData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [period]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const widgets = [
    {
      title: "Utilisateurs",
      icon: <Users size={24} />,
      value: counts.users,
      style: getThemeClass("bg-blue-200 text-blue-800", "bg-blue-800 text-blue-200", theme),
    },
    {
      title: "Cours",
      icon: <Music2 size={24} />,
      value: counts.courses,
      style: getThemeClass("bg-green-200 text-green-800", "bg-green-800 text-green-200", theme),
    },
    {
      title: "Produits",
      icon: <ShoppingCart size={24} />,
      value: counts.products,
      style: getThemeClass("bg-yellow-200 text-yellow-800", "bg-yellow-800 text-yellow-200", theme),
    },
    {
      title: "Revenus (€)",
      icon: <CreditCard size={24} />,
      value: counts.revenue.toLocaleString(),
      style: getThemeClass("bg-purple-200 text-purple-800", "bg-purple-800 text-purple-200", theme),
    },
  ];

  return (
    <div
      className={`container mx-auto p-4 ${getThemeClass("bg-white text-gray-900", "bg-gray-900 text-gray-100", theme)}`}
    >
      <h1 className="text-2xl font-bold mb-6">📊 Tableau de bord administrateur</h1>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {widgets.map((w, i) => (
          <div key={i} className={`p-4 rounded-lg shadow flex items-center justify-between ${w.style}`}>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">{w.title}</h2>
              <p className="text-2xl font-bold">{w.value}</p>
            </div>
            <div className ="text-2xl">{w.icon}</div>
          </div>
        ))}
      </div>

      {/* Contrôles du graphique */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">📈 Revenus mensuels</h2>
        <select
          value={period}
          onChange={handlePeriodChange}
          className={getThemeClass(
            "bg-white border border-gray-300 text-black",
            "bg-gray-800 border border-gray-700 text-white",
            theme
          ) + " rounded p-2"}
        >
          <option value="daily">Quotidien</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuel</option>
          <option value="yearly">Annuel</option>
        </select>
      </div>

      {/* Graphique */}
      <div
        className={`p-4 rounded-lg shadow mb-8 ${getThemeClass("bg-gray-200", "bg-gray-900", theme)}`}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke={theme === "dark" ? "#ccc" : "#333"} />
            <YAxis stroke={theme === "dark" ? "#ccc" : "#333"} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                borderColor: theme === "dark" ? "#4b5563" : "#e5e7eb",
              }}
              formatter={(value) => `${value.toLocaleString()} €`}
            />
            <Bar dataKey="totalAmount" name="Revenu total" fill={theme === "dark" ? "#8884d8" : "#82ca9d"} />
            <Bar dataKey="netAmount" name="Revenu net" fill={theme === "dark" ? "#82ca9d" : "#8884d8"} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;