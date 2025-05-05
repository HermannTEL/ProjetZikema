import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useVideoCourse } from "../../../../utils/hooks";
import { Select, SelectItem } from "../../../../components/ui"; // ✅ Utilisation de tes composants

const VideoCourses = () => {
  const { fetchVideoCourses } = useVideoCourse();
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState({ level: "", instrument: "", type: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchVideoCourses();
        console.log(result);
        setCourses(result || []);
      } catch (error) {
        console.error("Erreur lors du chargement des cours vidéo :", error);
      }
    };
    load();
  }, []); // ✅ Important : [] pour que ça charge une seule fois

  const instruments = [...new Set(courses.flatMap(c => c.instrument || []))];
  const levels = ["Débutant", "Intermédiaire", "Avancé"];
  const types = ["recorded", "live", "webinar", "masterclass"];

  const filteredCourses = courses.filter(c =>
    (!filter.level || c.level === filter.level) &&
    (!filter.type || c.type === filter.type) &&
    (!filter.instrument || (Array.isArray(c.instrument) && c.instrument.includes(filter.instrument)))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">🎥 Cours Vidéo</h2>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select value={filter.instrument} onValueChange={(val) => setFilter(f => ({ ...f, instrument: val }))}>
          <SelectItem value="">🎼 Tous les instruments</SelectItem>
          {instruments.map((i, index) => (
            <SelectItem key={index} value={i}>{i}</SelectItem>
          ))}
        </Select>

        <Select value={filter.level} onValueChange={(val) => setFilter(f => ({ ...f, level: val }))}>
          <SelectItem value="">📈 Tous les niveaux</SelectItem>
          {levels.map((l, index) => (
            <SelectItem key={index} value={l}>{l}</SelectItem>
          ))}
        </Select>

        <Select value={filter.type} onValueChange={(val) => setFilter(f => ({ ...f, type: val }))}>
          <SelectItem value="">📚 Tous les types</SelectItem>
          {types.map((t, index) => (
            <SelectItem key={index} value={t}>{t}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course._id} className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
            <img
              src={course.thumbnail || "/img/video-placeholder.jpg"}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{course.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                🎼 {course.instrument?.join(", ")} • 📊 {course.level} • 📚 {course.type}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 my-2 line-clamp-3">
                {course.description}
              </p>

              <div className="flex justify-between items-center">
                {course.isFree || course.price === 0 ? (
                  <span className="text-green-600 text-sm font-semibold">Gratuit</span>
                ) : (
                  <span className="text-blue-600 text-sm font-semibold">{course.price.toFixed(2)} €</span>
                )}

                <Link
                  to={`/student/my-courses/video/${course._id}`}
                  className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
                >
                  {course.isFree ? "Voir" : "Acheter"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 mt-4">Aucun cours vidéo trouvé.</p>
      )}
    </div>
  );
};

export { VideoCourses };
