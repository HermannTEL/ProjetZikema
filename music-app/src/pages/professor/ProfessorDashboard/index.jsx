import { useEffect, useRef, useState } from "react";
import { Calendar, UserRound, Video, BarChart3 } from "lucide-react";
import { useCourse, useProgress, useSchedule, useTheme } from "../../../utils/hooks";
import { Loader, ProgressCircle } from "../../../components/ui";

const ProfessorDashboard = () => {
  const { fetchProfessorSchedule } = useSchedule();
  const { fetchCourseByProf } = useCourse();
  const { fetchProfessorEvaluations } = useProgress();
  const { theme } = useTheme();

  const [upcoming, setUpcoming] = useState([]);
  const [courses, setCourses] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const professor = useRef();
  const isDarkMode = theme === 'dark';
 
  useEffect(() => {
    if (storedUser) {
      professor.current = storedUser;
    }
  }, [storedUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (professor.current && professor.current.role === "professor") {
          const schedules = await fetchProfessorSchedule(professor.current._id);
          const coursesList = await fetchCourseByProf(professor.current._id);
          const evaluationsList = await fetchProfessorEvaluations(professor.current._id);
          
          // Filtrer les sessions à venir et les trier par date
          const upcomingSessions = schedules
            .filter(s => new Date(s.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
            
          setUpcoming(upcomingSessions);
          setCourses(coursesList || []);
          setEvaluations(evaluationsList || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (professor.current) {
      fetchData();
    }
  }, []);

  // Calcul des métriques
  const calculateMetrics = () => {
    // Nombre d'étudiants uniques
    const activeStudents = evaluations.length > 0 
      ? [...new Set(evaluations.map(e => e.student._id))].length 
      : 0;
    
    // Nombre de cours vidéo (en ligne)
    const videoCourses = courses.filter(c => c.location?.type === "online").length;
    
    // Taux d'évaluations
    const evaluationRate = courses.length > 0 
      ? (evaluations.length / courses.length) * 100 
      : 0;
      
    return { activeStudents, videoCourses, evaluationRate };
  };

  const { activeStudents, videoCourses, evaluationRate } = calculateMetrics();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader size="lg" color={isDarkMode ? "orange" : "blue"} speed="fast" ariaLabel="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`p-6 max-w-6xl mx-auto space-y-8 transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">👨‍🏫 Tableau de bord professeur</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4">
          <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cours à venir</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">{upcoming.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4">
          <UserRound className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Élèves actifs</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">{activeStudents}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4">
          <Video className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cours vidéo</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">{videoCourses}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4">
          <BarChart3 className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Taux d'évaluations</p>
            <ProgressCircle completed={evaluationRate} theme={theme} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">📅 Prochains cours</h3>
        {upcoming.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcoming.map((session) => (
              <li key={session._id} className="py-3 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between items-center">
                  <div>
                    {new Date(session.date).toLocaleDateString()} — {session.startTime} à {session.endTime}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {session.roomNumber || "En ligne"} • {session.currentCapacity}/{session.maxCapacity} élèves
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {session.notes || "Aucune note pour ce cours"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucun cours à venir</p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">🧾 Derniers feedbacks</h3>
        {evaluations.length > 0 ? (
          <ul className="space-y-3">
            {evaluations.slice(0, 3).map((evaluation) => (
              <li key={evaluation._id} className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {evaluation.student.email && evaluation.student.email.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Note globale: {evaluation.evaluation.overall}/10
                  </p>
                </div>
                <p className="text-sm italic mt-1 text-gray-600 dark:text-gray-300">{evaluation.feedback}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {evaluation.strengths.slice(0, 2).map((strength, idx) => (
                    <span key={idx} className={`px-2 py-1 text-xs rounded-full ${
                      isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'
                    }`}>
                      {strength}
                    </span>
                  ))}
                  {evaluation.areasToImprove.slice(0, 1).map((area, idx) => (
                    <span key={idx} className={`px-2 py-1 text-xs rounded-full ${
                      isDarkMode ? 'bg-amber-900 text-amber-100' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {area}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucune évaluation disponible</p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">🎵 Mes cours</h3>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200">
                <h4 className="font-medium text-lg text-gray-800 dark:text-white">{course.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{course.instrument} • {course.level}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-sm px-2 py-1 rounded ${
                    isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {course.type === "individual" ? "Individuel" : "Collectif"}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.price}€/{course.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucun cours disponible</p>
        )}
      </div>
    </div>
  );
};

export default ProfessorDashboard;