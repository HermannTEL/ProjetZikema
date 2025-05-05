import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import { Loader } from "../../../components/ui/Loader";
import { useCourse } from "../../../utils/hooks";
import PropTypes from "prop-types";

const VideoCoursePlayer = ({ id }) => {
//   const { id } = useParams();
  const { getVideoCourseById } = useCourse();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getVideoCourseById(id);
      setCourse(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <Loader />;

  if (!course) return (
    <div className="p-6 text-center text-gray-600 dark:text-gray-300">
      Ce cours vidéo n'existe pas ou n&apos;est pas accessible.
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{course.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{course.instrument?.join(", ")} • {course.level}</p>

      {/* Vidéo principale */}
      {course.content?.videoUrl ? (
        <div className="mb-4">
          <video controls className="w-full rounded-xl shadow-lg">
            <source src={course.content.videoUrl} type="video/mp4" />
            Votre navigateur ne prend pas en charge la vidéo.
          </video>
        </div>
      ) : (
        <div className="mb-4 text-red-500">Vidéo non disponible.</div>
      )}

      {/* Chapitres */}
      {course.content?.chapters?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">📑 Chapitres</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
            {course.content.chapters.map((chap, idx) => (
              <li key={idx} className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <span className="font-semibold">{chap.title}</span>
                <span>{formatTime(chap.startTime)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fichiers à télécharger */}
      {course.attachments?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">📎 Ressources</h3>
          <ul className="space-y-2">
            {course.attachments.map((file, idx) => (
              <li key={idx}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {file.title} ({file.type})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Résumé / Objectifs */}
      {course.outcomes?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">🎯 Ce que vous allez apprendre</h3>
          <ul className="list-disc ml-6 text-sm text-gray-600 dark:text-gray-300">
            {course.outcomes.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
      )}

      {/* Évaluation */}
      <div className="mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">⭐ Note moyenne : {course.rating?.average ?? "0.0"} ({course.rating?.count ?? 0} votes)</p>
      </div>
    </div>
  );
};

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
};

VideoCoursePlayer.propTypes = {
    id: PropTypes.string.isRequired,
}

export default VideoCoursePlayer;
