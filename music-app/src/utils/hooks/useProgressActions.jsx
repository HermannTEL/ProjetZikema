import { useState } from "react";
import useFetch from "../../services";

const useProgressActions = () => {
    const fetchData = useFetch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getAllProgress = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/progress", "GET");
            // console.log(res);
            if (!res) {
                console.log("No data received from the server. Please check your API endpoint.");
                setError("No data received from the server. Please check your API endpoint.");
                throw new Error("No data returned");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de récupération des projets");
        } finally {
            setLoading(false);
        }
    };

    const getProgressById = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/progress/progress/${id}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("No data received from the server. Please check your API endpoint.");
                setError("No data received from the server. Please check your API endpoint.");
                throw new Error("No data returned");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de récupération des projets");
        } finally {
            setLoading(false);
        }
    };

    const getStudentProgress = async (studentId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/progress/student/${studentId}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("No data received from the server. Please check your API endpoint.");
                setError("No data received from the server. Please check your API endpoint.");
                throw new Error("No data returned");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de récupération des projets");
        } finally {
            setLoading(false);
        }
    };

    const getProfessorEvaluations = async (profId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/progress/professor/evaluations/${profId}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("No data received from the server. Please check your API endpoint.");
                setError("No data received from the server. Please check your API endpoint.");
                throw new Error("No data returned");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de récupération des projets");
        } finally {
            setLoading(false);
        }
    };

    const getStudentCourseProgress = async (studentId, courseId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/progress/student/${studentId}/course/${courseId}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("No data received from the server. Please check your API endpoint.");
                setError("No data received from the server. Please check your API endpoint.");
                throw new Error("No data returned");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de récupération des projets");
        } finally {
            setLoading(false);
        }
    };

    const createProgress = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData("/progress", "POST", data);
            // console.log(res);
            if (!res) {
                console.log("No data received from the server. Please check your API endpoint.");
                setError("No data received from the server. Please check your API endpoint.");
                throw new Error("No data returned");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de création de progress");
        } finally {
            setLoading(false);
        }
    };

    const addFeedback = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData("/progress/feedback", "POST", data);
            // console.log(res);
            if (!res) {
                console.log("No data received from the server. Please check your API endpoint.");
                setError("No data received from the server. Please check your API endpoint.");
                throw new Error("No data returned");
            }
            return res.data;
        } catch(err) {
            console.error(err.message);
            setError("Erreur lors de création de feedback");
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/progress/progress/${id}`, "PUT", data);
            // console.log(res);
            if (!res) {
                console.log("No data received from the server. Please check your API endpoint.");
                setError("No data received from the server. Please check your API endpoint.");
                throw new Error("No data returned");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de mise à jour de progress");
        } finally {
            setLoading(false);
        }
    };

    const deleteProgress = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/progress/${id}`, "DELETE");
            // console.log(res);
            if (!res) {
                console.log("No data received from the server. Please check your API endpoint.");
                setError("No data received from the server. Please check your API endpoint.");
                throw new Error("No data returned");
            }
            return res.data;
        } catch(err) {
            console.error(err.message);
            setError("Erreur lors de suppression de progress");
        } finally {
            setLoading(false);
        }
    };

    return {
        getAllProgress,
        getProgressById,
        getStudentProgress,
        getProfessorEvaluations,
        getStudentCourseProgress,
        createProgress,
        addFeedback,
        updateProgress,
        deleteProgress,
        error,
        loading,
    };
};

export default useProgressActions;
