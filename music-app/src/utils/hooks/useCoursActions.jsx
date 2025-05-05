import { useState } from "react";
import useFetch from "../../services";

const useCoursActions = () => {
    const fetchData = useFetch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRequest = async (endpoint, method = "GET", body = null, customErrorMessage = "Erreur de traitement") => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchData(endpoint, method, body);
            if (!res?.data || (!res.data.success && !res.data.status)) {
                console.log(`API Error at ${endpoint}`, res);
                throw new Error(res?.data?.message || customErrorMessage);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(err.message || customErrorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        getCourses: () => handleRequest("/courses", "GET", null, "Erreur lors de la récupération des cours"),
        getCoursById: (id) => handleRequest(`/courses/${id}`, "GET", null, "Erreur lors de la récupération du cours"),
        searchCourses: (criteria) => handleRequest(`/courses/search-course`, "POST", criteria, "Erreur lors de la recherche de cours"),
        createCours: (data) => handleRequest(`/courses`, "POST", data, "Erreur lors de la création du cours"),
        updateCours: (id, data) => handleRequest(`/courses/${id}`, "PUT", data, "Erreur lors de la mise à jour du cours"),
        updateCoursStatus: (id, statusData) => handleRequest(`/courses/update-course-status/${id}`, "PUT", statusData, "Erreur lors de la mise à jour du statut du cours"),
        deleteCours: (id) => handleRequest(`/courses/${id}`, "DELETE", null, "Erreur lors de la suppression du cours"),
        getCoursesByProf: (professorId) => handleRequest(`/courses/courses-by-professor/${professorId}`, "GET", null, "Erreur lors de la récupération des cours par professeur"),
        getAvailableInstruments: () => handleRequest(`/courses/available-instruments`, "GET", null, "Erreur lors de la récupération des instruments"),
        getSimilarCourses: (id) => handleRequest(`/courses/similar-course/${id}`, "GET", null, "Erreur lors de la récupération des cours similaires"),
        loading,
        error,
    };
};

export default useCoursActions;
