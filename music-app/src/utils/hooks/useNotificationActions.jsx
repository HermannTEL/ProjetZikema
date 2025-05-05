import { useState } from "react";
import useFetch from "../../services";

const useNotificationActions = () => {
    const fetchData = useFetch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getUserNotifications = async (userId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/notifications/${userId}`, "GET");
            if (!res) {
                setError("Failed to fetch notifications");
                console.log("Error fetching notifications")
                throw new Error("Failed to fetch notifications");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    const createNotification = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData("/notifications", "POST", data);
            if (!res) {
                setError("Failed to create notification");
                console.log("Error creating notification")
                throw new Error("Failed to create notification");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la création de la notification");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/notifications/${id}/read`, "PATCH");
            if (!res) {
                setError("Failed to mark notification as read");
                console.log("Error marking notification as read")
                throw new Error("Failed to mark notification as read");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors du marquage de la notification comme lue");
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async (userId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/notifications/${userId}/read-all`, "PATCH");
            if (!res) {
                setError("Failed to mark all notifications as read");
                console.log("Error marking all notifications as read")
                throw new Error("Failed to mark all notifications as read");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors du marquage de toutes les notifications comme lues");
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/notifications/${id}`, "DELETE");
            if (!res) {
                setError("Failed to delete notification");
                console.log("Error deleting notification");
                throw new Error("Failed to delete notification");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la suppression de la notification");
        } finally {
            setLoading(false);
        }
    };

    const deleteReadNotifications = async (userId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/notifications/${userId}/read`, "DELETE");
            if (!res) {
                setError("Failed to delete read notifications");
                console.log("Error deleting read notifications");
                throw new Error("Failed to delete read notifications");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la suppression des notifications lues");
        } finally {
            setLoading(false);
        }
    };

    const countUnread = async (userId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/notifications/${userId}/unread-count`, "GET");
            if (!res) {
                setError("Failed to count unread notifications");
                console.log("Error counting unread notifications");
                throw new Error("Failed to count unread notifications");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors du comptage des notifications non lues");
        } finally {
            setLoading(false);
        }
    };

    return {
        getUserNotifications,
        createNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteReadNotifications,
        countUnread,
        error,
        loading,
    };
};

export default useNotificationActions;
