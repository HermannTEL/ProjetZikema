import { useState } from "react";
import useFetch from "../../services";

const useCenterActions = () => {
    const fetchData = useFetch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const createCenter = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData("/centers/create-center", "POST", data);
            if (!res) {
                console.error("Error creating center.");
                throw new Error("Failed to create center");
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error creating center:",
                err.message
            );
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addRoom = async (centerId, roomData) => {
        setLoading(true);
        try {
            const res = await fetchData(`/centers/add-room/${centerId}`, "POST", roomData );
            if (!res) {
                console.error("Error adding room.");
                throw new Error("Failed to add room");
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error adding room:",
                err.message
            )
            setError("Error adding room.");
        } finally {
            setLoading(false);
        }
    };

    const getAllCenters = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/centers", "GET");
            if (!res) {
                console.error("Error fetching centers.");
                throw new Error("Failed to get centers");
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error fetching centers:",
                err.message
            );
            setError("Error fetching centers.");
        } finally {
            setLoading(false);
        }
    };

    const getCenterById = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/centers/${id}`, "GET");
            if (!res) {
                console.error("Error fetching center.");
                throw new Error("Failed to get center");
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error fetching center:",
                err.message
            );
            setError("Error fetching center.");
        } finally {
            setLoading(false);
        }
    };

    const getCentersNearby = async (locationData) => {
        setLoading(true);
        try {
            const res = await fetchData("/centers/near-by-center", "GET", locationData);
            if (!res) {
                console.error("Error fetching nearby centers.");
                throw new Error("Failed to get centers near by");
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error fetching nearby centers:",
                err.message
            );
            setError("Error fetching nearby centers.");
        } finally {
            setLoading(false);
        }
    };

    const updateCenter = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/centers/update-center/${id}`, "PUT", data);
            if (!res) {
                console.error("Error updating center.");
                throw new Error("Failed to update center");
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error updating center:",
                err.message
            );
            setError("Error updating center.");
        } finally {
            setLoading(false);
        }
    };

    const updateRoom = async ( centerId, roomId, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/centers/${centerId}/update-room/${roomId}`, "PUT", data);
            if (!res) {
                console.error("Error updating room.");
                throw new new Error("Failed to update room");
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error updating room:",
                err.message
            );
            setError("Error updating room.");
        } finally {
            setLoading(false);
        }
    };

    const deleteCenter = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/centers/${id}`, "DELETE");
            if (!res) {
                console.error("Error deleting center.");
                throw new Error("Failed to delete center");
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error deleting center:",
                err.message
            );
            setError("Error deleting center.");
        } finally {
            setLoading(false);
        }
    };

    const updateCenterStatus = async (id, status) => {
        setLoading(true);
        try {
            const res = await fetchData(`/centers/update-center-status/${id}`, "PUT", { status });
            if (!res) {
                console.error("Error updating center status.");
                throw new Error("Failed to update center status");
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error updating center status:",
                err.message
            );
            setError("Error updating center status.");
        } finally {
            setLoading(false);
        }
    }

    const deleteRoom = async (centerId, roomId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/centers/${centerId}/room/${roomId}`, "DELETE");
            if (!res) {
                console.error("Error deleting room.");
                throw new Error("Failed to delete room");              
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error deleting room:",
                err.message
            );
            setError("Error deleting room.");
        } finally {
            setLoading(false);
        }
    };

    return {
        createCenter,
        addRoom,
        getAllCenters,
        getCenterById,
        getCentersNearby,
        updateCenter,
        updateRoom,
        updateCenterStatus,
        deleteCenter,
        deleteRoom,
        error,
        loading,
    };
};

export default useCenterActions;
