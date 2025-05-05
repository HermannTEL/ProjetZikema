import { useEffect, useState } from "react";
import {
  Pencil, Eye, Clock, BookOpen, Music2, User,
  Check, X, Trash2, Plus
} from "lucide-react";
import { useCourse, useTheme, useToast } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";
import CourseProfileEditor from "../../../Profile/CourseProfileEditor";

const AllCourses = () => {
  const { courses: coursesList, fetchCourses, updateCourse, deleteCourse } = useCourse();
  const { theme } = useTheme();
  const { toast } = useToast();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // null => création

  const fetchAllCourses = async () => {
    const res = await fetchCourses();
    console.log(res, coursesList);
    setCourses(res.data || coursesList.data || []);
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instrument.toLowerCase().includes(search.toLowerCase())
  );

  const handleDisplay = (course) => {
    setSelectedCourse(course); // cours existant
    setDisplay(true);
  };

  const handleCreate = () => {
    setSelectedCourse(null); // aucun cours sélectionné => mode création
    setDisplay(true);
  };

  const toggleStatus = async (course) => {
    const newStatus = course.status === "active" ? "inactive" : "active";
    await updateCourse(course._id, { status: newStatus });
    setCourses((prev) =>
      prev.map((c) =>
        c._id === course._id ? { ...c, status: newStatus } : c
      )
    );
    toast({ title: "Statut mis à jour", description: `Le cours "${course.title}" est maintenant ${newStatus}.` });
  };

  const handleDelete = async (course) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      await deleteCourse(course._id);
      setCourses((prev) => prev.filter((c) => c._id !== course._id));
      toast({ title: "Cours supprimé", description: `Le cours "${course.title}" a été supprimé.` });
    }
  };

  return (
    <>
      {display ? (
        <CourseProfileEditor
          courseId={selectedCourse?._id}
          onClose={() => {
            setDisplay(false);
            fetchAllCourses();
          }}
        />
      ) : (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
              📚 Tous les cours
            </h2>
            <button
              onClick={handleCreate}
              className={getThemeClass("bg-green-600 text-white p-2 rounded-lg hover:bg-green-700", "bg-green-800 text-white p-2 rounded-lg hover:bg-green-900", theme)}
            >
              <Plus className="inline w-5 h-5 mr-2" />
              Nouveau Cours
            </button>
          </div>

          <input
            className={getThemeClass("input-style max-w-lg", "input-style max-w-lg bg-gray-800 text-white border-gray-600", theme)}
            placeholder="Rechercher un cours ou instrument..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <p className={getThemeClass("text-gray-500 col-span-full", "text-gray-300 col-span-full", theme)}>
                Aucun cours trouvé.
              </p>
            ) : (
              filtered.map((c) => (
                <div
                  key={c._id}
                  className={getThemeClass("bg-white p-4 rounded-xl shadow space-y-2", "bg-gray-800 p-4 rounded-xl shadow space-y-2", theme)}
                >
                  {c?.imageUrl && (
                    <img
                      src={c.imageUrl}
                      alt="Illustration du cours"
                      className="rounded-md object-cover w-full h-40"
                      onError={(e) => (e.target.src = "/default-course.jpg")}
                    />
                  )}
                  <h3 className={getThemeClass("text-xl font-semibold text-gray-800", "text-xl font-semibold text-white", theme)}>
                    <BookOpen className="inline w-5 h-5 mr-2 text-blue-600" />
                    {c.title}
                  </h3>
                  <p className={getThemeClass("text-sm text-gray-600", "text-sm text-gray-300", theme)}>
                    <Music2 className="inline w-4 h-4 mr-1" />
                    {c.instrument} • {c.level}
                  </p>
                  <p className={getThemeClass("text-sm text-gray-600", "text-sm text-gray-300", theme)}>
                    <User className="inline w-4 h-4 mr-1" />
                    {c.professor?.firstname} {c.professor?.lastname}
                  </p>
                  <p className={getThemeClass("text-sm text-gray-600", "text-sm text-gray-300", theme)}>
                    <Clock className="inline w-4 h-4 mr-1" />
                    {c.duration} min • {c.price} €
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        c.status === "active"
                          ? getThemeClass("bg-green-100 text-green-700", "bg-green-900 text-green-100", theme)
                          : getThemeClass("bg-red-100 text-red-700", "bg-red-900 text-red-100", theme)
                      }`}
                    >
                      {c.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className={`rounded-full p-0.5 ${getThemeClass("bg-blue-200 text-blue-800", "bg-blue-800 text-blue-200", theme)}`}
                        onClick={() => handleDisplay(c)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className={`btn-sm ${c.status === "active"
                          ? `rounded-full p-0.5 ${getThemeClass("bg-red-300 text-red-900", "bg-red-900 text-red-200", theme)}`
                          : `${getThemeClass("text-green-700", "text-green-300", theme)}`
                        }`}
                        onClick={() => toggleStatus(c)}
                      >
                        {c.status === "active" ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className={`rounded-full p-0.5 ${getThemeClass("bg-orange-200 text-orange-800", "bg-orange-800 text-orange-200", theme)}`}
                        onClick={() => handleDelete(c)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AllCourses;
