import { createContext, useEffect, useState } from "react";
import useEnrollmentActions from "../hooks/useEnrollmentActions";
import { getLocalUser } from "../functions";

const EnrollmentContext = createContext();

const EnrollmentProvider = ({ children }) => {
    const actions = useEnrollmentActions();
    const [enrollments, setEnrollments] = useState([]);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = getLocalUser();
        if (loggedUser) setUser(loggedUser);
    }, []);

    const fetchAllEnrollments = async () => {
        const data = await actions.getAllEnrollments();
        if (data) setEnrollments(data);
        return data;
    };

    const fetchEnrollmentById = async (id) => {
        const data = await actions.getEnrollmentById(id);
        if (data) setSelectedEnrollment(data);
        return data;
    };

    const fetchStudentEnrollments = async (userId) => {
        if (!user) throw new Error("Utilisateur non connecté");
        return await actions.getStudentEnrollments(user._id || userId);
    };

    return (
        <EnrollmentContext.Provider
            value={{
                createEnrollment: actions.createEnrollment,
                addSchedules: actions.addSchedules,
                updateEnrollment: actions.updateEnrollment,
                updateRemainingSessions: actions.updateRemainingSessions,
                deleteEnrollment: actions.deleteEnrollment,
                fetchAllEnrollments,
                fetchEnrollmentById,
                fetchStudentEnrollments,
                enrollments,
                selectedEnrollment,
                loading: actions.loading,
                error: actions.error,
            }}
        >
            {children}
        </EnrollmentContext.Provider>
    );
};

export { EnrollmentProvider, EnrollmentContext };
