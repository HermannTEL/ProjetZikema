import { useEffect, useRef, useState } from "react";
import { CalendarClock, MapPin, Video, User, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { useSchedule } from "../../../../utils/hooks";

const SessionManagement = () => {
  const { fetchProfessorSchedule } = useSchedule();
  const [sessions, setSessions] = useState([]);
  const storedUser  = JSON.parse(localStorage.getItem('user'));

  const professor = useRef();

  useEffect(() => {
      if (storedUser ) {
          professor.current = storedUser ;
      }
  }, [storedUser ]);

  useEffect(() => {
    const fetchSessions = async () => {
      const profId = professor.current._id;
      const data = await fetchProfessorSchedule(profId);
      const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setSessions(sorted);
    };
    fetchSessions();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">📋 Mes sessions à venir</h2>

      {sessions.length === 0 && (
        <p className="text-gray-500 dark:text-gray-300">Aucune session trouvée.</p>
      )}

      {sessions.map((s) => (
        <div key={s._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{s.course?.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              s.status === "completed" ? "bg-green-100 text-green-800" :
              s.status === "cancelled" ? "bg-red-100 text-red-800" :
              "bg-blue-100 text-blue-800"
            }`}>
              {s.status}
            </span>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <p className="flex items-center gap-2"><CalendarClock className="w-4 h-4" /> 
              {format(new Date(s.date), 'dd MMM yyyy')} — {s.startTime} → {s.endTime}
            </p>
            {s.roomNumber && (
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Salle : {s.roomNumber}</p>
            )}
            {s.videoLink && (
              <p className="flex items-center gap-2"><Video className="w-4 h-4" />
                <a href={s.videoLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Lien visio</a>
              </p>
            )}
          </div>

          {s.enrolledStudents?.length > 0 && (
            <div className="pt-2 text-sm flex flex-wrap gap-2">
              {s.enrolledStudents.map((e, i) => (
                <span key={i} className="inline-flex items-center bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-800 dark:text-white text-xs">
                  <User className="w-3 h-3 mr-1" /> {e.student?.firstname || "Élève"}
                  {e.attendance === "present" && <CheckCheck className="w-3 h-3 text-green-500 ml-1" />}
                </span>
              ))}
            </div>
          )}

          {s.notes && (
            <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-2">📝 {s.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SessionManagement;
