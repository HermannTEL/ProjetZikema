import { useEffect, useState } from "react";
import {
  Eye,
  Play,
  UploadCloud,
  Archive,
  XCircle,
} from "lucide-react";
import { useVideoCourse, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const VideoCourses = () => {
  const { fetchVideoCourses, updateVideoCourse, deleteVideoCourse } = useVideoCourse();
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchVideoCourses();
      setVideos(res || []);
    };
    fetch();
  }, []);

  const filtered = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.instrument.join(", ").toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (course, status) => {
    const updated = await updateVideoCourse(course._id, { status });
    if (updated) {
      setVideos((prev) =>
        prev.map((v) => (v._id === course._id ? { ...v, status } : v))
      );
    }
  };

  const handleDelete = async (id) => {
    await deleteVideoCourse(id);
    setVideos((prev) => prev.filter((v) => v._id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
        🎥 Cours vidéo
      </h2>

      <input
        className={getThemeClass("input-style max-w-md", "input-style max-w-md bg-gray-800 text-white border-gray-600", theme)}
        placeholder="Rechercher par titre ou instrument..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <p className={getThemeClass("text-gray-500 col-span-full", "text-gray-300 col-span-full", theme)}>
            Aucun cours vidéo trouvé.
          </p>
        ) : (
          filtered.map((v) => (
            <div
              key={v._id}
              className={getThemeClass("bg-white p-4 rounded-xl shadow space-y-2", "bg-gray-800 p-4 rounded-xl shadow space-y-2", theme)}
            >
              <h3 className={getThemeClass("text-xl font-semibold text-gray-800", "text-xl font-semibold text-white", theme)}>
                <Play className="inline w-5 h-5 mr-2 text-indigo-600" />
                {v.title}
              </h3>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                🧑‍🏫 Prof : {v.teacher?.firstname} {v.teacher?.lastname}
              </p>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                🎸 Instruments : {v.instrument?.join(", ") || "-"} | 🎯 Niveau : {v.level}
              </p>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                🎬 Type : {v.type} | 🎥 Format : {v.format || "video"}
              </p>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                💰 {v.price} € | {v.isFree ? "Gratuit" : "Payant"}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    v.status === "published"
                      ? getThemeClass("bg-green-100 text-green-700", "bg-green-900 text-green-100", theme)
                      : v.status === "archived"
                      ? getThemeClass("bg-gray-200 text-gray-600", "bg-gray-700 text-gray-300", theme)
                      : getThemeClass("bg-yellow-100 text-yellow-700", "bg-yellow-900 text-yellow-100", theme)
                  }`}
                >
                  {v.status}
                </span>
                <div className="flex gap-2">
                  <button className="btn-sm btn-outline text-blue-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  {v.status !== "published" && (
                    <button
                      onClick={() => handleToggleStatus(v, "published")}
                      className="btn-sm btn-primary"
                    >
                      <UploadCloud className="w-4 h-4" />
                    </button>
                  )}
                  {v.status !== "archived" && (
                    <button
                      onClick={() => handleToggleStatus(v, "archived")}
                      className="btn-sm btn-warning"
                    >
                      <Archive className="w-4 h-4 text-amber-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="btn-sm btn-danger"
                  >
                    <XCircle className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoCourses;
