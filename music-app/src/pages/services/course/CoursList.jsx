import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCourse } from "../../../utils/hooks";

const CoursList = () => {
    const { courses, fetchCourses, loading, error } = useCourse();

    useEffect(() => {
        fetchCourses();
    });

    return (
        <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">🎵 Liste des cours disponibles</h2>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((cours) => (
            <div key={cours.id} className="bg-white dark:bg-gray-800 rounded p-4 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{cours.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{cours.description.slice(0, 80)}...</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Niveau : {cours.level}</p>
                <Link
                to={`/courses/${cours.id}`}
                className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                Voir les détails →
                </Link>
            </div>
            ))}
        </div>
        </div>
    );
};

export default CoursList;
