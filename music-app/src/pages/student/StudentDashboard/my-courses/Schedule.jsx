import { useEffect, useState, useMemo, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { format } from "date-fns";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSchedule, useTheme } from "../../../../utils/hooks";

const localizer = momentLocalizer(moment);

// Styles globaux pour le calendrier selon le thème
const darkCalendarStyles = `
  .dark-calendar .rbc-calendar {
    background-color: #1f2937;
    color: white;
  }
  
  .dark-calendar .rbc-month-view,
  .dark-calendar .rbc-time-view,
  .dark-calendar .rbc-agenda-view,
  .dark-calendar .rbc-header,
  .dark-calendar .rbc-time-header,
  .dark-calendar .rbc-day-bg,
  .dark-calendar .rbc-time-content,
  .dark-calendar .rbc-month-row {
    border-color: #374151;
  }
  
  .dark-calendar .rbc-today {
    background-color: #374151;
  }
  
  .dark-calendar .rbc-off-range-bg {
    background-color: #111827;
  }
  
  .dark-calendar .rbc-off-range {
    color: #6b7280;
  }
  
  .dark-calendar .rbc-header,
  .dark-calendar .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
    background-color: #1f2937;
    color: white;
  }
  
  .dark-calendar .rbc-time-gutter,
  .dark-calendar .rbc-label {
    color: #e5e7eb;
  }
`;

const StudentSchedule = () => {
  const { fetchStudentSchedules } = useSchedule();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  // Ajouter les styles au document une seule fois au montage du composant
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = darkCalendarStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const result = await fetchStudentSchedules();
        setSessions(result || []);
      } catch (err) {
        setError("Erreur lors du chargement du planning");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const events = useMemo(() => 
    sessions.map(session => ({
      id: session._id,
      title: `${session.course?.title || "Cours"} - ${session.professor?.firstname || "Prof"}`,
      start: new Date(session.date + "T" + session.startTime),
      end: new Date(session.date + "T" + session.endTime),
      courseId: session.course?._id,
      videoLink: session.videoLink,
      status: session.status,
      roomNumber: session.roomNumber,
      professor: session.professor
    })), 
  [sessions]);

  const eventStyleGetter = useCallback((event) => {
    // Couleurs adaptées selon le thème dark/light
    const isDark = theme === 'dark';
    
    let backgroundColor;
    switch(event.status) {
      case "scheduled":
        backgroundColor = isDark ? "#3b82f6" : "#60a5fa";
        break;
      case "in-progress":
        backgroundColor = isDark ? "#8b5cf6" : "#a78bfa";
        break;
      case "completed":
        backgroundColor = isDark ? "#16a34a" : "#22c55e";
        break;
      case "cancelled":
        backgroundColor = isDark ? "#dc2626" : "#f87171";
        break;
      default:
        backgroundColor = isDark ? "#6b7280" : "#d1d5db";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        color: "white",
        padding: "4px",
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: isDark ? '0 2px 4px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
      }
    };
  }, [theme]);

  const handleSelectEvent = useCallback((event) => {
    const time = format(event.start, "HH:mm") + " - " + format(event.end, "HH:mm");
    const date = format(event.start, "dd/MM/yyyy");
    
    const statusMessages = {
      "scheduled": "Programmé",
      "in-progress": "En cours",
      "completed": "Terminé",
      "cancelled": "Annulé"
    };
    
    const modal = document.createElement("div");
    modal.className = `fixed inset-0 flex items-center justify-center z-50 ${theme === 'dark' ? 'bg-black bg-opacity-70' : 'bg-gray-500 bg-opacity-50'}`;
    
    modal.innerHTML = `
      <div class="${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-xl font-bold mb-2">${event.title}</h3>
        <p class="mb-1">📅 Date: ${date}</p>
        <p class="mb-1">🕒 Horaire: ${time}</p>
        <p class="mb-1">👨‍🏫 Professeur: ${event.professor?.firstname || ""} ${event.professor?.lastname || ""}</p>
        ${event.roomNumber ? `<p class="mb-1">🏫 Salle: ${event.roomNumber}</p>` : ''}
        ${event.videoLink ? `<p class="mb-1">🔗 Lien: <a href="${event.videoLink}" target="_blank" class="text-blue-500 hover:underline">${event.videoLink}</a></p>` : `<p class="mb-1">🔗 Lien: Pas de lien</p>`}
        <p class="mb-4">📊 Statut: <span class="${
          event.status === 'scheduled' ? 'text-blue-500' : 
          event.status === 'in-progress' ? 'text-purple-500' : 
          event.status === 'completed' ? 'text-green-500' : 
          'text-red-500'
        }">${statusMessages[event.status] || event.status}</span></p>
        <button class="${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-2 rounded">Fermer</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.querySelector("button").addEventListener("click", () => {
      document.body.removeChild(modal);
    });
    
    // Fermer en cliquant en dehors
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }, [theme]);

  const customDayPropGetter = useCallback((date) => {
    const today = new Date();
    const isToday = 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    
    return {
      className: isToday ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} font-bold` : '',
      style: isToday ? {
        border: `2px solid ${theme === 'dark' ? '#3b82f6' : '#60a5fa'}`
      } : {}
    };
  }, [theme]);

  // Personnalisation des composants du calendrier selon le thème
  const components = {
    toolbar: (toolbarProps) => (
      <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 flex justify-between items-center`}>
        <div>
          <button
            className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-1 rounded-l`}
            onClick={() => toolbarProps.onNavigate('PREV')}
          >
            &lt;
          </button>
          <button
            className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-1`}
            onClick={() => toolbarProps.onNavigate('TODAY')}
          >
            Aujourd'hui
          </button>
          <button
            className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-1 rounded-r`}
            onClick={() => toolbarProps.onNavigate('NEXT')}
          >
            &gt;
          </button>
        </div>
        <div className="text-xl font-bold">
          {toolbarProps.label}
        </div>
        <div>
          <button
            className={`${toolbarProps.view === 'month' ? (theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500') + ' text-white' : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')} px-3 py-1 rounded-l`}
            onClick={() => toolbarProps.onView('month')}
          >
            Mois
          </button>
          <button
            className={`${toolbarProps.view === 'week' ? (theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500') + ' text-white' : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')} px-3 py-1`}
            onClick={() => toolbarProps.onView('week')}
          >
            Semaine
          </button>
          <button
            className={`${toolbarProps.view === 'day' ? (theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500') + ' text-white' : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')} px-3 py-1 rounded-r`}
            onClick={() => toolbarProps.onView('day')}
          >
            Jour
          </button>
        </div>
      </div>
    )
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">🗓️ Mon Planning</h2>

      <div className={`h-[80vh] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-lg p-4`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className={`w-12 h-12 border-4 border-t-4 rounded-full animate-spin ${theme === 'dark' ? 'border-gray-600 border-t-blue-500' : 'border-gray-200 border-t-blue-600'}`}></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className={`text-red-500 text-center`}>
              <p className="text-xl mb-2">❌ {error}</p>
              <button 
                className={`mt-4 px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  fetchStudentSchedules().then(result => {
                    setSessions(result || []);
                    setIsLoading(false);
                  }).catch(err => {
                    setError("Erreur lors du chargement du planning");
                    console.error(err);
                    setIsLoading(false);
                  });
                }}
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-xl mb-2">📅 Aucun cours programmé</p>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Votre planning est actuellement vide</p>
            </div>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            views={["month", "week", "day"]}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={customDayPropGetter}
            components={components}
            className={theme === 'dark' ? 'dark-calendar' : 'light-calendar'}
          />
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <div className={`flex items-center px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <span>Programmé</span>
        </div>
        <div className={`flex items-center px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
          <span>En cours</span>
        </div>
        <div className={`flex items-center px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span>Terminé</span>
        </div>
        <div className={`flex items-center px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span>Annulé</span>
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;