import { useEffect, useRef, useState } from "react";
import { CalendarClock, Users, MapPin, BookOpenText } from "lucide-react";
import { Link } from "react-router-dom";
import { useCourse } from "../../../../utils/hooks";

const ActiveCourses = () => {
  const { fetchCourseByProf } = useCourse();
  const [courses, setCourses] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const professor = useRef();

 useEffect(() => {
    if (storedUser) {
      professor.current = storedUser;
    }
  }, [storedUser]);

  useEffect(() => {
    const fetch = async () => {
      // console.log(professor);
      const data = await fetchCourseByProf(professor.current._id);
      const active = data?.filter(c => c.status === "active") || [];
      setCourses(active);
    };
    fetch();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">🎼 Cours actifs</h2>

      {courses.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">Aucun cours actif pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{course.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{course.instrument} — {course.level}</p>
                </div>
                {course.imageUrl && (
                  <img
                    src={course.imageUrl}
                    alt="cours"
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {course.capacity?.max || 1} places max — type : {course.type}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4" />
                  Durée : {course.duration} min
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {course.location?.type === "center"
                    ? `Centre - ${course.center?.name || "Inconnu"}`
                    : course.location?.type === "online"
                    ? "En ligne"
                    : `À domicile`}
                </p>
              </div>

              <div className="flex justify-between mt-3">
                <Link
                  to={`/prof/schedule/sessions?courseId=${course._id}`}
                  className="btn-primary text-sm"
                >
                  Voir planning
                </Link>
                <Link
                  to={`/prof/my-courses/edit/${course._id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Modifier
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveCourses;
