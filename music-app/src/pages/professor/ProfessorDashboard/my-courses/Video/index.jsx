import { useEffect, useRef, useState } from "react";
import { VideoIcon, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useVideoCourse } from "../../../../../utils/hooks";
import CreateVideoCourse from "./CreateVideoCourse";
import VideoCourseDetail from "./VideoCourseDetail";

const VideoCourses = () => {
    const { fetchCourseByProf } = useVideoCourse();
    const [videos, setVideos] = useState([]);
    const [isCreating, setIsCreating] = useState(false); // State to control visibility of CreateVideoCourse
    const [isEditing, setIsEditing] = useState(false); // State to control visibility of Edit
    const [videoCourseId, setVideoCourseId] = useState({}); // State to store
    const storedUser  = JSON.parse(localStorage.getItem('user'));

    const professor = useRef();

    useEffect(() => {
        if (storedUser ) {
            professor.current = storedUser ;
        }
    }, [storedUser ]);

    useEffect(() => {
        const fetch = async () => {
            if (professor.current) {
                const res = await fetchCourseByProf(professor.current._id);
                setVideos(res || []);
            }
        };
        fetch();
    }, [professor.current?._id]); // Add dependency to re-fetch when professor changes

    const handleCreate = () => {
        setIsCreating(!isCreating); // Show the CreateVideoCourse component
    };

    const handleDisplay = (id) => {
        if (id) {
            setVideoCourseId(id);
            setIsEditing(true); // Show the Edit component
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">🎥 Mes cours vidéo</h2>
                <button onClick={handleCreate} className="btn-primary">➕ Ajouter</button>
            </div>

            {isCreating && <CreateVideoCourse onClose={() => setIsCreating(!isCreating)} />} {/* Render CreateVideoCourse if isCreating is true */}

            {videos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">Aucun cours vidéo trouvé.</p>
            ) : (
                (isEditing ? (
                    <VideoCourseDetail videoCourseId={videoCourseId}/>
                ) : (
                    
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {videos.map((course) => (
                        <div key={course._id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                            <img
                                src={course.thumbnail || "/thumbnail-placeholder.png"}
                                alt={course.title}
                                className="w-full h-36 object-cover"
                            />
                            <div className="p-4 space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {course.level} • {course.type} • {course.content?.duration || 0} min
                                </p>
                                <Link
                                    onClick={()=>handleDisplay(course._id)}
                                    className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                                >
                                    <Eye className="w-4 h-4" /> Voir
                                </Link>
                            </div>
                        </div>
                    ))}
                    
                </div>
            )))}
        </div>
    );
};

export default VideoCourses;