import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarDays } from "lucide-react";
import { useCourse, useSchedule, useUser, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const GlobalSchedule = () => {
  const { fetchAllSchedules } = useSchedule();
  const { fetchCourses } = useCourse();
  const { fetchAllUsers } = useUser();
  const { theme } = useTheme();

  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    instrument: "",
    professorId: "",
    level: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [schedules, courses, users] = await Promise.all([
        fetchAllSchedules(),
        fetchCourses(),
        fetchAllUsers(),
      ]);

      const eventData = schedules.map((s) => {
        const course = courses.find((c) => c._id === s.course);
        const prof = users.find((u) => u._id === s.professor);

        return {
          id: s._id,
          title: course ? course.title : "Cours inconnu",
          start: new Date(s.date + "T" + s.startTime),
          end: new Date(s.date + "T" + s.endTime),
          backgroundColor:
            course?.level === "Débutant"
              ? "#4ade80"
              : course?.level === "Intermédiaire"
              ? "#facc15"
              : "#f87171",
          extendedProps: {
            professor: prof?.firstname + " " + prof?.lastname,
            instrument: course?.instrument,
            level: course?.level,
          },
        };
      });

      setEvents(eventData);
    };

    fetchData();
  }, []);

  const filteredEvents = events.filter((e) => {
    return (
      (!filters.instrument || e.extendedProps.instrument === filters.instrument) &&
      (!filters.professorId || e.extendedProps.professor.includes(filters.professorId)) &&
      (!filters.level || e.extendedProps.level === filters.level)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme) + " flex items-center gap-2"}>
        <CalendarDays className="w-6 h-6 text-indigo-500" />
        Planning global des cours
      </h2>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          placeholder="Filtrer par instrument"
          className={getThemeClass("input-style", "input-style bg-gray-800 text-white border-gray-600", theme)}
          onChange={(e) =>
            setFilters((f) => ({ ...f, instrument: e.target.value }))
          }
        />
        <input
          placeholder="Par professeur"
          className={getThemeClass("input-style", "input-style bg-gray-800 text-white border-gray-600", theme)}
          onChange={(e) =>
            setFilters((f) => ({ ...f, professorId: e.target.value }))
          }
        />
        <select
          className={getThemeClass("input-style", "input-style bg-gray-800 text-white border-gray-600", theme)}
          onChange={(e) =>
            setFilters((f) => ({ ...f, level: e.target.value }))
          }
        >
          <option value="">Tous niveaux</option>
          <option value="Débutant">Débutant</option>
          <option value="Intermédiaire">Intermédiaire</option>
          <option value="Avancé">Avancé</option>
        </select>
      </div>

      {/* Calendrier */}
      <div className={getThemeClass("bg-white p-4 rounded-xl shadow", "bg-gray-900 p-4 rounded-xl shadow", theme)}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          editable={false}
          selectable={false}
          events={filteredEvents}
          height="auto"
        />
      </div>
    </div>
  );
};

export default GlobalSchedule;
