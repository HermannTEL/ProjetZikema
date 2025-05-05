import { createContext, useEffect, useState } from "react";
import useUserActions from "../hooks/useUserActions";
import { getLocalUser } from "../functions";
import { useAuth } from "../hooks";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const actions = useUserActions();
    const [currentUser, setCurrentUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { register } = useAuth();

    useEffect(() => {
        const loggedUser = getLocalUser();
        if (loggedUser) setUser(loggedUser);
    }, []);

    const handleRequest = async (fn, ...params) => {
        setLoading(true);
        try {
            const res = await fn(...params);
            console.log("res: ", res);
            if (!res) throw new Error("Une erreur est survenue. Veuillez réessayer plus tard");
            
            if (res) return res.data;
            return res.data;
        } catch (err) {
            console.log(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentUser = async () => {
        const data = await handleRequest(actions.getMe, user?._id);
        if (data) setCurrentUser(data);
        return data;
    };

    const fetchAllUsers = () => handleRequest(actions.getAllUsers).then(setUserList);
    const fetchProfessors = () => handleRequest(actions.getAllProfessors).then(setProfessors);
    const fetchProfStudents = (profId) => handleRequest(actions.getProfStudents, profId);
    // const fetchUserById = (id) => handleRequest(actions.getUserById, id).then(setCurrentUser);
    const fetchUserById = async (id) => {
        const data = await handleRequest(actions.getUserById, id);
        if (data) {
          setCurrentUser(data);
        }
        return data; // <<< TRÈS IMPORTANT
    };
    

    const createUser = (data) => handleRequest(register, data);

    const handleForgotPassword = (email) => handleRequest(actions.forgotPassword, email);
    const handleResetPassword = (token, password) => handleRequest(actions.resetPassword, token, password);
    const handleUpdateUser = (id, data) => handleRequest(actions.updateUser, id, data);
    const handleUpdateProfile = (id, data) => handleRequest(actions.updateProfile, id, data);
    const handleUpdatePassword = (id, data) => handleRequest(actions.updatePassword, id, data);
    const handleUpdateAvailability = (id, data) => handleRequest(actions.updateAvailability, id, data);
    const handleUpdateNotificationPreferences = (id, data) => handleRequest(actions.updateNotificationPreferences, id, data);
    const handleToggleUserStatus = (id) => handleRequest(actions.toggleUserStatus, id);
    const handleDeleteUser = (id) => handleRequest(actions.deleteUser, id);

    // console.log(userList);
    console.log(currentUser);
    return (
        <UserContext.Provider value={{
            currentUser,
            userList,
            professors,
            fetchCurrentUser,
            fetchAllUsers,
            fetchProfessors,
            fetchProfStudents,
            fetchUserById,
            createUser,
            forgotPassword: handleForgotPassword,
            resetPassword: handleResetPassword,
            updateUser: handleUpdateUser,
            updateProfile: handleUpdateProfile,
            updatePassword: handleUpdatePassword,
            updateAvailability: handleUpdateAvailability,
            updateNotificationPreferences: handleUpdateNotificationPreferences,
            toggleUserStatus: handleToggleUserStatus,
            deleteUser: handleDeleteUser,
            loading,
            error,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };
