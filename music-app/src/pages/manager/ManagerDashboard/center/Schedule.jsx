import { useEffect, useState } from "react";
import { CalendarDays, Users, Music, Building2 } from "lucide-react";
import { useSchedule, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const CenterScheduleManager = () => {
  const { fetchAllSchedules } = useSchedule();
  const { theme } = useTheme();
  const [schedules, setSchedules] = useState([]);
  const [filter, setFilter] = useState({ instrument: "", professor: "", room: "" });

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchAllSchedules();
      setSchedules(data || []);
    };
    fetch();
  }, []);

  const filtered = schedules.filter((s) => {
    return (
      (!filter.instrument || s.course?.instrument.toLowerCase() === filter.instrument.toLowerCase()) &&
      (!filter.professor || s.professor?.firstname?.toLowerCase().includes(filter.professor.toLowerCase())) &&
      (!filter.room || s.roomNumber?.toLowerCase().includes(filter.room.toLowerCase()))
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
        📅 Planning global
      </h2>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="input-style"
          placeholder="Instrument"
          value={filter.instrument}
          onChange={(e) => setFilter({ ...filter, instrument: e.target.value })}
        />
        <input
          className="input-style"
          placeholder="Professeur"
          value={filter.professor}
          onChange={(e) => setFilter({ ...filter, professor: e.target.value })}
        />
        <input
          className="input-style"
          placeholder="Salle"
          value={filter.room}
          onChange={(e) => setFilter({ ...filter, room: e.target.value })}
        />
      </div>

      {/* Planning */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>Aucun cours trouvé pour ces filtres.</p>
        ) : (
          filtered.map((s, i) => (
            <div
              key={i}
              className={getThemeClass(
                "bg-white p-4 rounded-xl shadow flex justify-between items-center",
                "bg-gray-800 p-4 rounded-xl shadow flex justify-between items-center",
                theme
              )}
            >
              <div>
                <h3 className={getThemeClass("text-lg font-semibold text-gray-800", "text-lg font-semibold text-white", theme)}>
                  {s.course?.title}
                </h3>
                <p className={getThemeClass("text-sm text-gray-600", "text-sm text-gray-300", theme)}>
                  <CalendarDays className="inline w-4 h-4 mr-1" /> {new Date(s.date).toLocaleDateString()} | {s.startTime} - {s.endTime}
                </p>
                <p className={getThemeClass("text-sm text-gray-600", "text-sm text-gray-300", theme)}>
                  <Music className="inline w-4 h-4 mr-1" /> {s.course?.instrument} | <Users className="inline w-4 h-4 mr-1" /> {s.enrolledStudents?.length || 0} élève(s)
                </p>
              </div>
              <div className="text-right">
                <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                  <strong>Prof :</strong> {s.professor?.firstname} {s.professor?.lastname}
                </p>
                <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                  <Building2 className="inline w-4 h-4 mr-1" /> Salle : {s.roomNumber || "Non précisé"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CenterScheduleManager;
