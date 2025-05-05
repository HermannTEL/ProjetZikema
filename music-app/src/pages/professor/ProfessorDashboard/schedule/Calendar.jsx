import { useEffect, useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { format, parseISO } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useSchedule } from "../../../../utils/hooks";

const localizer = momentLocalizer(moment);

const ProfessorCalendar = () => {
  const { fetchProfessorSchedule } = useSchedule();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const profId = JSON.parse(localStorage.getItem("user"))._id;
      const data = await fetchProfessorSchedule(profId);
      const mapped = data.map((session) => ({
        id: session._id,
        title: session.course?.title || "Cours",
        start: new Date(session.date + "T" + session.startTime),
        end: new Date(session.date + "T" + session.endTime),
        resource: session,
      }));
      setEvents(mapped);
    };
    fetchData();
  }, []);

  const eventStyleGetter = (event) => {
    const baseStyle = {
      backgroundColor: "#2563eb",
      color: "white",
      borderRadius: "8px",
      padding: "4px",
      border: "none",
    };

    if (event.resource.status === "completed") {
      baseStyle.backgroundColor = "#10b981"; // green
    } else if (event.resource.status === "cancelled") {
      baseStyle.backgroundColor = "#ef4444"; // red
    }

    return { style: baseStyle };
  };

  const handleEventClick = (event) => {
    alert(`Cours: ${event.title}\nHeure: ${format(event.start, 'HH:mm')} → ${format(event.end, 'HH:mm')}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">📅 Mon agenda</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick}
        />
      </div>
    </div>
  );
};

export default ProfessorCalendar;
