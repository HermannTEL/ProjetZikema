import { useEffect, useState } from "react";
import { CalendarClock, Building2, Music, Users, UserRound } from "lucide-react";
import { useSchedule, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const TeamScheduleManager = () => {
  const { fetchAllSchedules } = useSchedule();
  const { theme } = useTheme();
  const [schedules, setSchedules] = useState([]);
  const [filter, setFilter] = useState({ professor: "", instrument: "", day: "" });

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchAllSchedules();
      setSchedules(result || []);
    };
    fetch();
  }, []);

  const filtered = schedules.filter((s) => {
    return (
      (!filter.professor ||
        s.professor?.firstname?.toLowerCase().includes(filter.professor.toLowerCase())) &&
      (!filter.instrument || s.course?.instrument === filter.instrument) &&
      (!filter.day || new Date(s.date).toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase() === filter.day)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-gray-800", "text-white", theme) + " text-3xl font-bold"}>
        🗓️ Emploi du temps des professeurs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="input-style"
          placeholder="Professeur"
          value={filter.professor}
          onChange={(e) => setFilter({ ...filter, professor: e.target.value })}
        />
        <input
          className="input-style"
          placeholder="Instrument"
          value={filter.instrument}
          onChange={(e) => setFilter({ ...filter, instrument: e.target.value })}
        />
        <select
          className="input-style"
          value={filter.day}
          onChange={(e) => setFilter({ ...filter, day: e.target.value })}
        >
          <option value="">Jour</option>
          {["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>
            Aucun résultat pour ces filtres.
          </p>
        ) : (
          filtered.map((s, i) => (
            <div
              key={i}
              className={getThemeClass("bg-white", "bg-gray-800", theme) + " p-5 rounded-xl shadow-md flex justify-between items-start"}
            >
              <div>
                <h4 className={getThemeClass("text-gray-800", "text-white", theme) + " text-lg font-bold"}>{s.course?.title}</h4>
                <p className={getThemeClass("text-gray-500", "text-gray-300", theme) + " text-sm"}>
                  <CalendarClock className="inline w-4 h-4 mr-1" />
                  {new Date(s.date).toLocaleDateString()} — {s.startTime} à {s.endTime}
                </p>
                <p className={getThemeClass("text-gray-500", "text-gray-300", theme) + " text-sm"}>
                  <UserRound className="inline w-4 h-4 mr-1" />
                  {s.professor?.firstname} {s.professor?.lastname}
                </p>
                <p className={getThemeClass("text-gray-500", "text-gray-300", theme) + " text-sm"}>
                  <Building2 className="inline w-4 h-4 mr-1" />
                  Salle : {s.roomNumber || "Non précisé"}
                </p>
              </div>
              <div className={getThemeClass("text-gray-600", "text-gray-300", theme) + " text-sm space-y-1 text-right"}>
                <p>
                  <Music className="inline w-4 h-4 mr-1" /> {s.course?.instrument}
                </p>
                <p>
                  <Users className="inline w-4 h-4 mr-1" /> {s.enrolledStudents?.length || 0} élève(s)
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamScheduleManager;
