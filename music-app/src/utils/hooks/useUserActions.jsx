import { useState } from "react";
import useFetch from "../../services";

const useUserActions = () => {
    const fetchData = useFetch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRequest = async (endpoint, method = "GET", body = null, customErrorMessage = "Erreur de traitement") => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchData(endpoint, method, body);
            // console.log("Ressponse: ", res);
            if (!res || (res.data?.success === false || res.data?.status === false)) {
                console.log(`API error at ${endpoint}`, res);
                throw new Error(res?.data?.message || customErrorMessage);
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError(err.message || customErrorMessage);
            throw err; // Important : pour permettre aux composants de capturer l'erreur s'ils veulent
        } finally {
            setLoading(false);
        }
    };

    return {
        getMe: (userId) => handleRequest(`/users/me/${userId}`, "GET", null, "Erreur lors de la récupération de l'utilisateur connecté"),
        getAllUsers: () => handleRequest("/users/", "GET", null, "Erreur lors de la récupération des utilisateurs"),
        getUserById: (id) => handleRequest(`/users/${id}`, "GET", null, "Erreur lors de la récupération de l'utilisateur"),
        getAllProfessors: () => handleRequest("/users/professors", "GET", null, "Erreur lors de la récupération des professeurs"),
        getProfStudents: (profId) => handleRequest(`/users/professor/${profId}/students`, "GET", null, "Erreur lors de la récupération des étudiants du professeur"),
        forgotPassword: (email) => handleRequest("/users/forgot-password", "POST", { email }, "Erreur lors de l'envoi de l'email de réinitialisation"),
        resetPassword: (token, password) => handleRequest(`/users/reset-password/${token}`, "POST", { password }, "Erreur lors de la réinitialisation du mot de passe"),
        updateUser: (id, data) => handleRequest(`/users/${id}`, "PUT", data, "Erreur lors de la mise à jour de l'utilisateur"),
        updateProfile: (id, data) => handleRequest(`/users/me/${id}`, "PUT", data, "Erreur lors de la mise à jour du profil"),
        updatePassword: (id, data) => handleRequest(`/users/me/password/${id}`, "PUT", data, "Erreur lors de la mise à jour du mot de passe"),
        updateAvailability: (id, data) => handleRequest(`/users/me/${id}/availability`, "PUT", data, "Erreur lors de la mise à jour de la disponibilité"),
        updateNotificationPreferences: (id, data) => handleRequest(`/users/me/${id}/notification-preferences`, "PUT", data, "Erreur lors de la mise à jour des préférences de notification"),
        toggleUserStatus: (id) => handleRequest(`/users/${id}/toggle-status`, "PATCH", null, "Erreur lors du changement de statut utilisateur"),
        deleteUser: (id) => handleRequest(`/users/${id}`, "DELETE", null, "Erreur lors de la suppression de l'utilisateur"),
        loading,
        error,
    };
};

export default useUserActions;
