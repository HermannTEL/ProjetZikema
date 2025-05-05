import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from '../../../../components/ui';
import { useEnrollment, useSchedule, useTheme } from "../../../../utils/hooks";
import CourseScheduleModal from "./CourseScheduleModal";

const ActiveCourses = () => {
  const { fetchStudentEnrollments } = useEnrollment();
  const { fetchCourseSchedule } = useSchedule();
  const { theme } = useTheme();
  const [enrollments, setEnrollments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchStudentEnrollments(); // ID pris du token côté backend
        console.log("Data: ", data);
        setEnrollments(data.data.filter(e => e.status === "confirmed" || e.status === "pending"));
      } catch (error) {
        console.error("Erreur lors du chargement des inscriptions :", error);
      }
    };
    load();
  }, []); // ✅ Fix boucle infinie

  const openScheduleModal = async (courseId) => {
    try {
      const result = await fetchCourseSchedule(courseId);
      console.log(result);
      setSchedules(result);
      setSelectedCourse(courseId);
      setModalOpen(true);
    } catch (err) {
      console.error("Erreur en récupérant le planning :", err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSchedules([]);
    setSelectedCourse(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">🎓 Mes cours actifs</h2>

      {enrollments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Vous n&apos;êtes inscrit à aucun cours actuellement.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {enrollments.map((enr) => {
            const completed = enr.package?.quantity && enr.package?.remainingSessions != null
              ? ((enr.package.quantity - enr.package.remainingSessions) / enr.package.quantity) * 100
              : 0;

            return (
              <div key={enr._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {enr.course?.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      🎼 {enr.course?.instrument} • 📊 {enr.course?.level} • 👨‍🏫 {enr.course?.professor?.firstname}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      ⏳ Début : {enr.startDate ? new Date(enr.startDate).toLocaleDateString() : "N/D"} • Fin :{" "}
                      {enr.endDate ? new Date(enr.endDate).toLocaleDateString() : "N/D"}
                    </p>

                    {enr.package && (
                      <div className="mt-3">
                        <ProgressBar completed={Math.round(completed)} />
                        <p className="text-xs text-gray-400 mt-1">
                          {enr.package?.remainingSessions ?? 0} session{enr.package?.remainingSessions === 1 ? "" : "s"} restante{enr.package?.remainingSessions > 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      onClick={() => openScheduleModal(enr.course?._id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Voir planning →
                    </Link>
                    <Link
                      to={`/student/my-courses/resources?courseId=${enr.course?._id}`}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Ressources
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Modal Planning */}
          <CourseScheduleModal
            open={modalOpen}
            onClose={closeModal}
            schedules={schedules}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
};

export default ActiveCourses;
