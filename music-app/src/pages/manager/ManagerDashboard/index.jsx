import { useEffect, useState } from "react";
import { CalendarDays, Users, School, Building, ChevronRight } from "lucide-react";
import { getThemeClass } from "../../../utils/functions";
import { useTheme } from "../../../utils/hooks";

const ManagerDashboard = () => {
  const { theme } = useTheme();

  const [stats, setStats] = useState({
    profs: 5,
    students: 32,
    courses: 12,
    rooms: 4
  });

  const [sessions, setSessions] = useState([
    { time: "10:00", course: "Piano Avancé", prof: "Mme Durand", room: "Salle A" },
    { time: "14:00", course: "Chant débutant", prof: "M. Martin", room: "Studio 2" }
  ]);

  const [recentStudents, setRecentStudents] = useState([
    { name: "Léa Dupont" },
    { name: "Ibrahim Ndiaye" },
    { name: "Sophie Bernard" }
  ]);

  const [profs, setProfs] = useState([
    { name: "Mme Durand", avatar: "/avatars/1.png" },
    { name: "M. Martin", avatar: "/avatars/2.png" }
  ]);

  useEffect(() => {
    // TODO: fetch stats & sessions depuis backend
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
        🏫 Tableau de bord centre
      </h2>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard theme={theme} icon={<Users />} label="Profs" value={stats.profs} />
        <StatCard theme={theme} icon={<School />} label="Élèves" value={stats.students} />
        <StatCard theme={theme} icon={<CalendarDays />} label="Cours actifs" value={stats.courses} />
        <StatCard theme={theme} icon={<Building />} label="Salles" value={stats.rooms} />
      </div>

      {/* Planning du jour */}
      <div className={getThemeClass("bg-white p-5 rounded-xl shadow space-y-4", "bg-gray-800 p-5 rounded-xl shadow space-y-4", theme)}>
        <h3 className={getThemeClass("text-xl font-semibold text-gray-800", "text-xl font-semibold text-white", theme)}>
          📅 Planning du jour
        </h3>
        {sessions.map((s, i) => (
          <div key={i} className={getThemeClass("flex justify-between text-sm text-gray-600", "flex justify-between text-sm text-gray-300", theme)}>
            <div>{s.time} - {s.course}</div>
            <div>{s.prof} ({s.room})</div>
          </div>
        ))}
      </div>

      {/* Professeurs actifs */}
      <div className={getThemeClass("bg-white p-5 rounded-xl shadow space-y-3", "bg-gray-800 p-5 rounded-xl shadow space-y-3", theme)}>
        <h3 className={getThemeClass("text-xl font-semibold text-gray-800", "text-xl font-semibold text-white", theme)}>
          🧑‍🏫 Professeurs actifs
        </h3>
        <div className="flex gap-4">
          {profs.map((p, i) => (
            <div key={i} className="text-center">
              <img src={p.avatar} alt={p.name} className="w-14 h-14 rounded-full mx-auto" />
              <p className={getThemeClass("text-sm mt-1 text-gray-700", "text-sm mt-1 text-gray-200", theme)}>{p.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nouveaux élèves */}
      <div className={getThemeClass("bg-white p-5 rounded-xl shadow space-y-3", "bg-gray-800 p-5 rounded-xl shadow space-y-3", theme)}>
        <h3 className={getThemeClass("text-xl font-semibold text-gray-800", "text-xl font-semibold text-white", theme)}>
          🧑‍🎓 Nouveaux élèves
        </h3>
        <ul className="space-y-2">
          {recentStudents.map((s, i) => (
            <li key={i} className={getThemeClass("flex items-center justify-between text-sm text-gray-700", "flex items-center justify-between text-sm text-gray-200", theme)}>
              {s.name}
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, theme }) => (
  <div className={getThemeClass("bg-white p-4 rounded-xl shadow flex flex-col items-center gap-2 text-center", "bg-gray-800 p-4 rounded-xl shadow flex flex-col items-center gap-2 text-center", theme)}>
    <div className="text-blue-500">{icon}</div>
    <div className={getThemeClass("text-2xl font-bold text-gray-800", "text-2xl font-bold text-white", theme)}>{value}</div>
    <div className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>{label}</div>
  </div>
);

export default ManagerDashboard;
