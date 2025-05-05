import { createContext, useState } from "react";
import useCoursActions from "../hooks/useCoursActions";

const CourseContext = createContext();

const CourseProvider = ({ children }) => {
    const actions = useCoursActions();
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [instruments, setInstruments] = useState([]);
    const [similarCourses, setSimilarCourses] = useState([]);

    const fetchCourses = async () => {
        const data = await actions.getCourses();
        // console.log("Fetch Courses: ", data)
        if (data) setCourses(data);
        return data.data;
    };

    const fetchCourseById = async (id) => {
        const data = await actions.getCoursById(id);
        // console.log("fetch Course By Id: ", data);
        if (data) setCourse(data);
        return data.data;
    };

    const fetchCourseByProf = async (profId) => {
        const data = await actions.getCoursesByProf(profId);
        if (data) setCourses(data);
        return data.data;
    };

    const fetchSearchCourse = async (criteria) => {
        const data = await actions.searchCourses(criteria);
        if (data) setCourses(data);
        return data;
    };

    const createCourse = async (courseData) => {
        const data = await actions.createCours(courseData);
        if (data) setCourse(data);
        return data;
    };

    const updateCourse = async (id, courseData) => {
        const data = await actions.updateCours(id, courseData);
        if (data) setCourse(data);
        return data;
    };

    const deleteCourse = async (id) => {
        const data = await actions.deleteCours(id);
        if (data) {
            setCourses((prev) => prev.filter((c) => c.id !== id));
        }
        return data;
    };

    const fetchInstruments = async () => {
        const data = await actions.getAvailableInstruments();
        if (data) setInstruments(data);
        return data;
    };

    const fetchSimilarCourses = async (id) => {
        const data = await actions.getSimilarCourses(id);
        if (data) setSimilarCourses(data);
        return data;
    };

    const changeCourseStatus = async (id, statusData) => {
        const data = await actions.updateCoursStatus(id, statusData);
        if (data) {
            setCourses((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status: statusData.status } : c))
            );
        }
        return data;
    };

    const clearCourse = () => setCourse(null);

    return (
        <CourseContext.Provider
            value={{
                fetchCourses,
                fetchCourseById,
                fetchCourseByProf,
                fetchSearchCourse,
                createCourse,
                updateCourse,
                deleteCourse,
                fetchInstruments,
                fetchSimilarCourses,
                changeCourseStatus,
                clearCourse,
                courses,
                course,
                instruments,
                similarCourses,
                searchTerm,
                setSearchTerm,
                loading: actions.loading,
                error: actions.error,
            }}
        >
            {children}
        </CourseContext.Provider>
    );
};

export { CourseProvider, CourseContext };
