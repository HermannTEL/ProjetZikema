import { createContext, useState } from "react";
import useVideoCourseActions from "../hooks/useVideoCourseActions";

const VideoCourseContext = createContext();

const VideoCourseProvider = ({ children }) => {
    const {
        getAllVideoCourses,
        getVideoCourseById,
        getVideoCourseByProf,
        getParticipantLink,
        getRecommendedCourses,
        getLiveSessionsReport,
        getSessionRecordings,
        createVideoCourse,
        addReview,
        manageLiveParticipants,
        startLiveSession,
        endLiveSession,
        addRecording,
        updateVideoCourse,
        deleteVideoCourse,
        deleteRecording,
    } = useVideoCourseActions();

    const [videoCourses, setVideoCourses] = useState([]);
    const [selectedVideoCourse, setSelectedVideoCourse] = useState(null);
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchVideoCourses = async () => {
        setLoading(true);
        try {
            const res = await getAllVideoCourses();
            // console.log(res)
            setVideoCourses(res);
            return res.data;
        } catch (err) {
            console.log("Error fetching video courses:", err.message)
            setError("Error fetching video courses: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchVideoCourseById = async (id) => {
        setLoading(true);
        try {
            const res = await getVideoCourseById(id);
            // console.log(res)
            setSelectedVideoCourse(res);
            return res.data;
        } catch (err) {
            console.log("Error fetching video course by id:", err.message)
            setError("Error fetching video course by id: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecordings = async (id) => {
        try {
            const res = await getSessionRecordings(id);
            // console.log(res)
            setRecordings(res);
        } catch (error) {
            console.log("Error fetching recordings:", error.message)
            setError("Error fetching recordings: " + error.message);
        } finally{
            setLoading(false);
        }
    };

    const fetchCourseByProf = async (profId) => {
        try {
            const res = await getVideoCourseByProf(profId);
            // console.log(res)
            return res.data
        } catch (error) {
            console.log("Error fetching courses by professor:", error.message)
            setError("Error fetching courses by professor: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <VideoCourseContext.Provider
            value={{
            videoCourses,
            selectedVideoCourse,
            recordings,
            fetchVideoCourses,
            fetchVideoCourseById,
            fetchCourseByProf,
            fetchRecordings,
            createVideoCourse,
            updateVideoCourse,
            deleteVideoCourse,
            addReview,
            manageLiveParticipants,
            startLiveSession,
            endLiveSession,
            addRecording,
            deleteRecording,
            getRecommendedCourses,
            getParticipantLink,
            getLiveSessionsReport,
            loading,
            error,
            }}
        >
            {children}
        </VideoCourseContext.Provider>
    );
};

export { VideoCourseProvider, VideoCourseContext };
