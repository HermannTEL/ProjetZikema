import { useState } from "react";
import useFetch from "../../services";

const useEnrollmentActions = () => {
    const fetchData = useFetch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRequest = async (endpoint, method = "GET", body = null, customErrorMessage = "Erreur de traitement") => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchData(endpoint, method, body);
            if (!res) {
                console.log(`API Error at ${endpoint}`, res);
                throw new Error(res?.data?.message || customErrorMessage);
            }
            if(res.data?.success === false) {
                console.log(`API Error at ${endpoint}`, res.data);
                return res.data;
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
        createEnrollment: (data) => handleRequest("/enrollments", "POST", data, "Erreur lors de la création de l'inscription"),
        addSchedules: (id, data) => handleRequest(`/enrollments/add-schedules/${id}`, "POST", data, "Erreur lors de l'ajout des horaires"),
        getAllEnrollments: () => handleRequest("/enrollments", "GET", null, "Erreur lors de la récupération des inscriptions"),
        getEnrollmentById: (id) => handleRequest(`/enrollments/${id}`, "GET", null, "Erreur lors de la récupération de l'inscription"),
        getStudentEnrollments: (studentId) => handleRequest(`/enrollments/student-enrollment/${studentId}`, "GET", null, "Erreur lors de la récupération des inscriptions de l'étudiant"),
        updateEnrollment: (id, data) => handleRequest(`/enrollments/${id}`, "PUT", data, "Erreur lors de la mise à jour de l'inscription"),
        updateRemainingSessions: (id, data) => handleRequest(`/enrollments/update-remaining-sessions/${id}`, "PUT", data, "Erreur lors de la mise à jour des séances restantes"),
        deleteEnrollment: (id) => handleRequest(`/enrollments/${id}`, "DELETE", null, "Erreur lors de la suppression de l'inscription"),
        loading,
        error,
    };
};

export default useEnrollmentActions;
