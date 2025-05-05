import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse, useEnrollment, useNotification, useSchedule, useUser } from "../../../utils/hooks";

const CoursDetail = () => {
    const { id } = useParams();
    const { fetchCurrentUser } = useUser();
    const { course, fetchCourseById } = useCourse();
    const { createEnrollment } = useEnrollment();
    const { getProfessorSchedules } = useSchedule();
    const { createNotification } = useNotification();

    const [user, setUser] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        handleFetchCurrentUser;
        fetchCourseById(id);
    }, [id]);

    useEffect(() => {
        if (course?.professorId) {
            getProfessorSchedules(course.professorId).then(setSchedules);
        }
    }, [course]);

    const handleFetchCurrentUser = async () => {
        try {
            const user = await fetchCurrentUser();
            if (!user) {
                setError('Utilisateur non trouvé');
            }
            setError(null)
            setUser(user);
        } catch (error) {
            console.error(error.message);
            setError('Une Erreur est survenue');
        }
    }

    const handleEnrollment = async () => {
        if (!selectedSchedule) {
        setError("Veuillez sélectionner un créneau.");
        return;
        }

        try {
            await createEnrollment({
                courseId: course.id,
                scheduleId: selectedSchedule.id,
                studentId: user._id,
            });

            await createNotification({
                userId: course.professorId,
                title: "Nouvelle inscription",
                message: `Un élève s’est inscrit à votre cours : ${course.title}`,
            });

            await createNotification({
                userId: user._id,
                title: "Confirmation d’inscription",
                message: `Vous êtes inscrit au cours : ${course.title}`,
            });

            setMessage("Inscription confirmée !");
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de l'inscription.");
        }
    };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{course?.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{course?.description}</p>

        {/* Créneaux disponibles */}
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Choisissez un créneau :</h3>
        <ul className="mb-4">
            {schedules.map((schedule) => (
                <li key={schedule.id}>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="schedule"
                            value={schedule.id}
                            onChange={() => setSelectedSchedule(schedule)}
                        />
                        <span className="text-sm dark:text-white">
                            {new Date(schedule.date).toLocaleString()} - {schedule.room}
                        </span>
                    </label>
                </li>
            ))}
        </ul>

      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleEnrollment}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        S'inscrire à ce créneau
      </button>
    </div>
  );
};

export default CoursDetail;
