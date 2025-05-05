import { useEffect, useState } from "react";
import { useCourse, useEnrollment, useSchedule, useTheme } from "../../../utils/hooks";

const StudentDashboard = () => {
  const { fetchStudentEnrollments } = useEnrollment();
  const { fetchCourseById } = useCourse();
  const { fetchScheduleById } = useSchedule();
  const { theme } = useTheme();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coursesDetails, setCoursesDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleFetchCurrentUser = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          setError('Utilisateur non trouvé');
          setLoading(false);
          return;
        }
        setStudent(user);
        setError(null);
      } catch (error) {
        console.error(error.message);
        setError('Une erreur est survenue lors de la récupération de l\'utilisateur.');
        setLoading(false);
      }
    };

    handleFetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!student) return;

      setLoading(true);

      try {
        const data = await fetchStudentEnrollments(student._id);
        console.log("Inscriptions récupérées :", data);

        const enriched = await Promise.all(
          data.data.map(async (e) => {
            const course = await fetchCourseById(e.course._id);
            const schedules = await Promise.all(
              e.schedules.map(async (schedule) => await fetchScheduleById(schedule._id))
            );
            return { ...e, course, schedules };
          })
        );

        setCoursesDetails(enriched);
      } catch (error) {
        console.error("Erreur lors de la récupération des inscriptions :", error);
        setError('Une erreur est survenue lors de la récupération des inscriptions.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [student]);

  return (
    <>
      <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🎓 Mes cours inscrits</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className={`p-4 mb-4 text-sm rounded ${theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-200 text-red-800'}`}>
              {error}
            </div>
          )}
          {coursesDetails.length === 0 ? (
            <p className={`text-gray-500 ${theme === 'dark' ? 'dark:text-gray-300' : ''}`}>Aucun cours inscrit pour le moment.</p>
          ) : (
            coursesDetails.map((enrollment) => (
              <div
                key={enrollment._id}
                className={`${theme === 'dark' ? 'bg-gray-800 text-blue-50' : 'bg-white text-black'} p-4 rounded shadow`}
              >
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  {enrollment.course?.title}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {enrollment.course?.description}
                </p>

                {enrollment.schedules?.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {enrollment.schedules.map((schedule) => (
                      <div key={schedule._id} className="text-sm">
                        <p>
                          📅 <strong>Créneau :</strong> {new Date(schedule.date).toLocaleString()}
                        </p>
                        <p>
                          📌 <strong>Salle :</strong> {schedule.room}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm mt-2 italic text-gray-400">Pas de créneau enregistré</p>
                )}

                <p className="text-sm mt-2">
                  ✅ <strong>Statut :</strong> {enrollment.status || "En cours"}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default StudentDashboard;
