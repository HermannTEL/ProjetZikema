import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, Pencil, ExternalLink } from "lucide-react";
import { useVideoCourse } from "../../../../../utils/hooks";
import PropTypes from "prop-types";

const VideoCourseDetail = ({videoCourseId}) => {
  const navigate = useNavigate();
  const { fetchVideoCourseById, deleteVideoCourse } = useVideoCourse();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchVideoCourseById(videoCourseId);
      setCourse(res);
    };
    fetch();
  }, [videoCourseId]);

  const handleDelete = async () => {
    if (confirm("Confirmer la suppression du cours vidéo ?")) {
      await deleteVideoCourse(videoCourseId);
      navigate("/prof/my-courses/video");
    }
  };

  if (!course) return <p className="p-6 text-gray-500 dark:text-gray-300">Chargement...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{course.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {course.instrument.join(", ")} — {course.level} — {course.type}
          </p>
        </div>
        <div className="space-x-2">
          <button onClick={() => navigate(`/prof/my-courses/video/edit/${videoCourseId}`)} className="btn-outline">
            <Pencil className="w-4 h-4 inline" /> Modifier
          </button>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 className="w-4 h-4 inline" /> Supprimer
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow">
        {course.thumbnail && (
          <img src={course.thumbnail} alt="thumbnail" className="w-full h-64 object-cover" />
        )}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300">{course.description}</p>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Durée :</p>
            <p className="text-lg text-gray-800 dark:text-white">{course.content?.duration} min</p>
          </div>

          <div className="mt-4">
            <a
              href={course.content?.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Voir la vidéo <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {course.attachments?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">📂 Ressources</h3>
          <ul className="space-y-2">
            {course.attachments.map((doc, i) => (
              <li key={i} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded">
                <span className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  {doc.title}
                </span>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Ouvrir
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

VideoCourseDetail.propTypes = {
    videoCourseId: PropTypes.string.isRequired,
}

export default VideoCourseDetail;
