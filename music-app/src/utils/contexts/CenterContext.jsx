import { createContext, useState } from "react";
import useCenterActions from "../hooks/useCenterActions";

const CenterContext = createContext();

const CenterProvider = ({ children }) => {
    const {
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
    } = useCenterActions();

    const [centers, setCenters] = useState([]);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAllCenters = async () => {
        setLoading(true);
        try {
            const res = await getAllCenters();
            console.log("fetch All Centers: ", res.data);
            if (res) {
                setCenters(res.data);
                setLoading(false);
                return res.data;
            }
        } catch (err) {
            console.error("Error fetching all centers:", err.message)
            setError("Error fetching all centers.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCenterById = async (id) => {
        setLoading(true);
        try {
            const res = await getCenterById(id);
            if (res) {
                setSelectedCenter(res.data);
                setLoading(false);
                return res.data;
            }
        } catch (err) {
            console.error("Error fetching center by id:", err.message);
            setError("Error fetching center by id. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCentersNearby = async (location) => {
        setLoading(true);
        try {
            const res = await getCentersNearby(location);
            console.log("res", res);
            if (res) {
                setCenters(res.data);
                setLoading(false);
                return res.data;
            }
        } catch (err) {
            console.error("Error fetching centers nearby:", err.message);
            setError("Error fetching centers nearby. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCenter = async (data) => {
        setLoading(true);
        try {
            const res = await createCenter(data);
            console.log("res", res);
            if (res) {
                // setCenters([...centers, res.data.center]);
                setLoading(false);
                return res.data;
            }
        } catch (err) {
            console.error("Error creating center:", err.message);
            setError("Error creating center. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const handleAddRoom = async (selectedCenterId, roomData) =>{
        setLoading(true);
        try {
            const res = await addRoom(selectedCenterId, roomData);
            if (res) {
                const updatedCenters = res?.centers?.map(center => center.id === selectedCenterId ? { ...center, rooms: [...center.rooms, res] } : center);
                setCenters(updatedCenters);
                return res;
            }
        } catch (err) {
            console.error("Error adding room:", err.message);
            setError("Error adding room. Please try again later.");
        } 
    }

    const handleUpdateCenterStatus = async (id, data) => {
        setLoading(true);
        try {
            const res = await updateCenterStatus(id, data);
            if (res) {
                const updatedCenters = centers.map(center => center.id === id ? { ...center, status: data.status } : center);
                setCenters(updatedCenters);
                setLoading(false);
                return res;
            }
        } catch (err) {
            console.error("Error updating center status:", err.message);
            setError("Error updating center status. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <CenterContext.Provider
            value={{
                createCenter: handleCreateCenter,
                addRoom: handleAddRoom,
                updateCenter,
                updateRoom,
                deleteCenter,
                deleteRoom,
                fetchAllCenters,
                fetchCenterById,
                fetchCentersNearby,
                updateCenterStatus: handleUpdateCenterStatus,
                centers,
                selectedCenter,
                loading,
                error,
            }}
        >
            {children}
        </CenterContext.Provider>
    );
};

export { CenterProvider, CenterContext };
