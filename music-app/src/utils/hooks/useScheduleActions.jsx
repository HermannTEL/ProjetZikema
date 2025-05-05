import { useState } from "react";
import useFetch from "../../services";

const useScheduleActions = () => {
    const fetchData = useFetch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getAllSchedules = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/schedules", "GET");
            // console.log(res);
            if (!res) {
                console.log("No schedules found. Please check your schedule settings.");
                setError("No schedules found. Please check your schedule settings.");
                throw new Error("Failed to fetch schedules");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des créneaux");
        } finally {
            setLoading(false);
        }
    };

    const getScheduleById = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/${id}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("Schedule not found");
                setError("Schedule not found");
                throw new Error("Failed to fetch schedule");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération du créneau");
        } finally {
            setLoading(false);
        }
    };

    const getCourseSchedule = async (courseId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/by-course/${courseId}`, "GET");
            if (!res || !res.data.success) {
                throw new Error(res?.data?.error || "Erreur lors de la récupération des horaires du cours");
            }
            return res.data.data; // ✅ Retourne seulement les schedules
        } catch (err) {
            console.error(err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getStudentSchedules = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/student/${id}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("No schedules found for this student");
                setError("No schedules found for this student");
                throw new Error("Failed to fetch student schedules");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des créneaux de l'élève");
        } finally {
            setLoading(false);
        }
    };

    const getProfessorSchedules = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/professor/${id}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("No schedules found for this professor");
                setError("No schedules found for this professor");
                throw new Error("Failed to fetch professor schedules");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des créneaux du professeur");
        } finally {
            setLoading(false);
        }
    };

    const getProfessorAvailability = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/professor/availability/${id}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("No availability found for this professor");
                setError("No availability found for this professor");
                throw new Error("Failed to fetch professor availability");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération de la disponibilité du professeur");
        } finally {
            setLoading(false);
        }
    };

    const createRecurringSchedules = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/recurring/${id}`, "POST", data);
            // console.log(res);
            if (!res) {
                console.log("Failed to create recurring schedules");
                setError("Failed to create recurring schedules");
                throw new Error("Failed to create recurring schedules");
            }
            return res.data;
        } catch(err) {
            console.error(err.message);
            setError("Erreur lors de la création des créneaux récurrents");
        } finally {
            setLoading(false);
        }
    };

    const markAsCompleted = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/completed/${id}`, "POST");
            // console.log(res);
            if (!res) {
                console.log("Failed to mark as completed");
                setError("Failed to mark as completed");
                throw new Error("Failed to mark schedule as completed");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la marquage du créneau comme terminé");
        } finally {
            setLoading(false);
        }
    };

    const markAttendance = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/attendance/${id}`, "POST");
            // console.log(res);
            if (!res) {
                console.log("Failed to mark attendance");
                setError("Failed to mark attendance");
                throw new Error("Failed to mark attendance");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la marquage de la présence");
        } finally {
            setLoading(false);
        }
    };

    const createSchedule = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData('/schedules', "POST", data);
            // console.log(res);
            if (!res) {
                console.log("Failed to create schedule");
                setError("Failed to create schedule");
                throw new Error("Failed to create schedule");
            }
            return res.data;
        } catch(err) {
            console.error(err.message);
            setError("Erreur lors de la création du créneau");
        } finally {
            setLoading(false);
        }
    };

    const enrollStudent = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/enroll/${id}`, "POST");
            // console.log(res);
            if (!res) {
                console.log("Failed to enroll student");
                setError("Failed to enroll student");
                throw new Error("Failed to enroll student");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de l'inscription du student");
        } finally {
            setLoading(false);
        }
    };

    const unenrollStudent = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/unenroll/${id}`, "POST");
            // console.log(res);
            if (!res) {
                console.log("Failed to unenroll student");
                setError("Failed to unenroll student");
                throw new Error("Failed to unenroll student");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la désinscription du student");
        } finally {
            setLoading(false);
        }
    };

    const updateSchedule = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/${id}`, "PUT", data);
            // console.log(res);
            if (!res) {
                console.log("Failed to update schedule");
                setError("Failed to update schedule");
                throw new Error("Failed to update schedule");
            }
            return res.data;
        } catch(err) {
            console.error(err.message);
            setError("Erreur lors de la mise à jour du créneau");
        } finally {
            setLoading(false);
        }
    };

    const deleteSchedule = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/schedules/${id}`, "DELETE");
            // console.log(res);
            if (!res) {
                console.log("Failed to delete schedule");
                setError("Failed to delete schedule");
                throw new Error("Failed to delete schedule");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la suppression du créneau");
        } finally {
            setLoading(false);
        }
    };

    return {
        getAllSchedules,
        getScheduleById,
        getStudentSchedules,
        getCourseSchedule,
        getProfessorSchedules,
        getProfessorAvailability,
        createRecurringSchedules,
        markAsCompleted,
        markAttendance,
        createSchedule,
        enrollStudent,
        unenrollStudent,
        updateSchedule,
        deleteSchedule,
        error,
        loading,
    };
};

export default useScheduleActions;
