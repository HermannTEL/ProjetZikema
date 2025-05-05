import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { useVideoCourse } from "../../../../utils/hooks";
import VideoCoursePlayer from "../VideoCoursePlayer";

const MyVideoCourses = () => {
  const { fetchVideoCourses } = useVideoCourse();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const load = async () => {
      const all = await fetchVideoCourses();
      // console.log(all);
      const owned = all.data?.filter(v => v.status === "published"); // simulation && (v.isFree || v.purchased)
      setVideos(owned || []);
    };
    load();
  }, []);

  const displayVideoPlayer = (id) => {
    return <VideoCoursePlayer id={id} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">🎥 Mes cours vidéo</h2>

      {videos.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucun cours vidéo disponible pour l&apos;instant.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(course => (
            <div key={course._id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow">
              <img
                src={course.thumbnail || "/img/video-placeholder.jpg"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {course.instrument?.join(", ")} • {course.level} • {course.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <button
                    onClick={()=>displayVideoPlayer(course._id)}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Lancer le cours →
                  </button>

                  {console.log("Course inbetween: ", course)}

                  {course.rating?.average && (
                    <span className="text-xs text-yellow-500">
                      ⭐ {course.rating.average.toFixed(1)} ({course.rating.count}){console.log(course)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVideoCourses;
