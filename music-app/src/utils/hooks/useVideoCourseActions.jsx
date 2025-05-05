import { useState } from "react";
import useFetch from "../../services";

const useVideoCourseActions = () => {
    const fetchData = useFetch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getAllVideoCourses = async () => {
        try {
            setLoading(true);
            const res = await fetchData("/videoCourses", "GET");
            console.log(res);
            if (!res || !res.data.success) {
                console.log("Error fetching video courses:", res.data.message);
                setError("No data returned");
                throw new Error("Error fetching video courses: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération de tous les cours vidéo");
        } finally {
            setLoading(false);
        }
    };
    
    const getVideoCourseById = async (id) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${id}`, "GET");
            // console.log(res);
            if (!res || !res.data.success) {
                console.log("Error fetching video course:", res.data.message);
                setError("No data returned");
                throw new Error("Error fetching video course: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de la récupération du cours vidéo avec l'ID ${id}`);
        } finally {
            setLoading(false);
        }
    };

    const getVideoCourseByProf = async (profId) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/by-teacher/${profId}`, "GET");
            // console.log(res);
            if (!res || !res.data.success) {
                console.log("Error fetching video course by prof:", res.data.message);
                setError("No data returned");
                throw new Error("Error fetching video course by prof: " + res.data.message);
            }
            return res.data;
        } catch(error) {
            console.error(error.message);
            setError("Erreur lors de la récupération des cours vidéo par prof");
        } finally {
            setLoading(false);
        }
    }
    
    const getParticipantLink = async (courseId) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${courseId}/participant-link`, "GET");
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de la récupération du lien participant");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de la récupération du lien participant pour le cours ${courseId}`);
        } finally {
            setLoading(false);
        }
    };
    
    const getRecommendedCourses = async (userId) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/recommended/${userId}`, "GET");
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de la récupération des cours recommandés");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de la récupération des cours recommandés pour l'utilisateur ${userId}`);
        } finally {
            setLoading(false);
        }
    };
    
    const getLiveSessionsReport = async () => {
        try {
            setLoading(true);
            const res = await fetchData("/videoCourses/live-sessions/report", "GET");
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de la récupération du rapport des sessions en direct");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération du rapport des sessions en direct");
        } finally {
            setLoading(false);
        }
    };
    
    const getSessionRecordings = async (id) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${id}/recordings`, "GET");
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de la récupération des enregistrements de la session");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de la récupération des enregistrements pour le cours vidéo avec l'ID ${id}`);
        } finally {
            setLoading(false);
        }
    };
    
    const createVideoCourse = async (data) => {
        try {
            setLoading(true);
            const res = await fetchData("/videoCourses", "POST", data);
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de la création du cours vidéo");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la création du cours vidéo");
        } finally {
            setLoading(false);
        }
    };
    
    const addReview = async (id, review) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${id}/review`, "POST", review);
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de l'ajout de l'avis");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de l'ajout de l'avis pour le cours vidéo avec l'ID ${id}`);
        } finally {
            setLoading(false);
        }
    };
    
    const manageLiveParticipants = async (id, data) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${id}/live-participants`, "POST", data);
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de la gestion des participants en direct");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de la gestion des participants en direct pour le cours vidéo avec l'ID ${id}`);
        } finally {
            setLoading(false);
        }
    };
    
    const startLiveSession = async (id) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${id}/start-live`, "POST");
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors du démarrage de la session en direct");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors du démarrage de la session en direct pour le cours vidéo avec l'ID ${id}`);
        } finally {
            setLoading(false);
        }
    };
    
    const endLiveSession = async (id) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${id}/end-live`, "POST");
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de la fin de la session en direct");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de la fin de la session en direct pour le cours vidéo avec l'ID ${id}`);
        } finally {
            setLoading(false);
        }
    };
    
    const addRecording = async (id, data) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${id}/recordings`, "POST", data);
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de l'ajout de l'enregistrement");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de l'ajout de l'enregistrement pour le cours vidéo avec l'ID ${id}`);
        } finally {
            setLoading(false);
        }
    };
    
    const updateVideoCourse = async (id, data) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${id}`, "PUT", data);
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de la mise à jour du cours vidéo");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de la mise à jour du cours vidéo avec l'ID ${id}`);
        } finally {
            setLoading(false);
        }
    };
    
    const deleteVideoCourse = async (id) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${id}`, "DELETE");
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de la suppression du cours vidéo");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de la suppression du cours vidéo avec l'ID ${id}`);
        } finally {
            setLoading(false);
        }
    };
    
    const deleteRecording = async (id, recordingId) => {
        try {
            setLoading(true);
            const res = await fetchData(`/videoCourses/${id}/recordings/${recordingId}`, "DELETE");
            // console.log(res)
            if (!res || !res.data.success) {
                console.log("Error fetching participant link:", res.data.message);
                setError("Erreur lors de la suppression de l'enregistrement");
                throw new Error("Error fetching participant link: " + res.data.message);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(`Erreur lors de la suppression de l'enregistrement avec l'ID ${recordingId} pour le cours vidéo avec l'ID ${id}`);
        } finally {
            setLoading(false);
        }
    };

    return {
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
        error,
        loading,
    };
};

export default useVideoCourseActions;
