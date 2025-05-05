import { createContext, useEffect, useState } from "react";
import useScheduleActions from "../hooks/useScheduleActions";

const ScheduleContext = createContext();

const ScheduleProvider = ({ children }) => {
  const {
    getAllSchedules,
    getScheduleById,
    getStudentSchedules,
    getCourseSchedule,
    getProfessorSchedules,
    getProfessorAvailability,
    createRecurringSchedules,
    createSchedule,
    enrollStudent,
    unenrollStudent,
    markAsCompleted,
    markAttendance,
    updateSchedule,
    deleteSchedule,
  } = useScheduleActions();

  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(()=>{
      const loggedUser = JSON.parse(localStorage.getItem('user'));
      // console.log(" Logged User: ", loggedUser);
      if(loggedUser) setUser(loggedUser);
  }, []);

  const fetchAllSchedules = async () => {
    setLoading(true);
    try {
      const res = await getAllSchedules();
      // console.log(res);
      setSchedules(res);
      return res.data;
    } catch (err) {
      console.log(err.message);
      setError("Error fetching schedules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleById = async (id) => {
    setLoading(true);
    try {
      const res = await getScheduleById(id);
      // console.log("Schedule by ID: ", res);
      if (!res || !res.success) {
        setError("Schedule not found");
        console.log("Erreur lors du chargement du schedule dans ScheduleContext->fetchScheduleById");
      }
      setSelectedSchedule(res);
      return res.data;
    } catch (err) {
      setError("Erreur lors du chargement du schedule");
      console.log("Erreur lors du chargement du schedule dans ScheduleContext->fetchScheduleById", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessorAvailability = async (id) => {
    setLoading(true);
    try {
      const res = await getProfessorAvailability(id);
      // console.log("Availability: ", res);
      setAvailability(res);
      return res.data;
    } catch (error) {
      console.log(error.message);
      setError("Error fetching professor availability. Please try again later.")      
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseSchedule = async (courseId) => {
    try {
      const res = await getCourseSchedule(courseId)
      if(!res || !res.success){
        console.log("Erreur lors du chargement des schedules dans ScheduleContext->fetchCourseSchedules")
        setError("Error fetching student schedules");
        throw new Error("Error fetching student schedules");
      }
      return res.data
    } catch (error) {
      setError("Erreur lors du chargement des créneaux.");
      console.log(error.message);
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentSchedules = async (userId) => {
    try {
      const res = await getStudentSchedules(user._id || userId);
      // console.log(res);
      if (!res) {
        console.log("Erreur lors du chargement des schedules dans ScheduleContext->fetchStudentSchedules");
        setError("Error fetching student schedules");
        throw new Error("Error fetching student schedules");
      }
      return res.data;
    } catch (error) {
      setError("Erreur lors du chargement des créneaux.");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchProfessorSchedule = async (userId) => {
    try {
      const res = await getProfessorSchedules(userId);
      // console.log(res);
      if (!res) {
        console.log("Erreur lors du chargement du schedule dans ScheduleContext->fetchProfessorSchedule");
        setError("Error fetching professor schedule");
        throw new Error("Error fetching professor schedule");
      }
      return res.data;
    } catch (err) {
      setError("Erreur lors du chargement du créneau.");
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScheduleContext.Provider
      value={{
        schedules,
        selectedSchedule,
        availability,
        fetchAllSchedules,
        fetchScheduleById,
        fetchProfessorAvailability,
        fetchStudentSchedules,
        fetchCourseSchedule,
        fetchProfessorSchedule,
        createRecurringSchedules,
        createSchedule,
        enrollStudent,
        unenrollStudent,
        markAsCompleted,
        markAttendance,
        updateSchedule,
        deleteSchedule,
        loading,
        error,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export { ScheduleProvider, ScheduleContext };
