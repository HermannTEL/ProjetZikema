import { createContext, useEffect, useState } from "react";
import useProgressActions from "../hooks/useProgressActions";

const ProgressContext = createContext();

const ProgressProvider = ({ children }) => {
  const {
    getAllProgress,
    getProgressById,
    getStudentProgress,
    getProfessorEvaluations,
    getStudentCourseProgress,
    createProgress,
    addFeedback,
    updateProgress,
    deleteProgress,
  } = useProgressActions();

  const [progressList, setProgressList] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if(loggedUser) setUser(loggedUser);
  }, []);

  const fetchAllProgress = async () => {
    setLoading(true);
    try {
      const res = await getAllProgress();
      // console.log(res);
      setProgressList(res);
      return res.data;
    } catch (err) {
      console.log(err.message);
      setError("Error fetching progress list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressById = async (id) => {
    setLoading(true);
    try {
      const res = await getProgressById(id);
      // console.log(res);
      setCurrentProgress(res);
      return res.data;
    } catch (err) {
      console.log(err.message);
      setError("Error fetching progress by id. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProgress = async (studentId) => {
    setLoading(true);
    try {
      const res = await getStudentProgress(user._id || studentId);
      // console.log(res);
      setProgressList(res);
      return res.data;
    } catch (err) {
      console.log(err.message)
      setError( "Error fetching student progress." );
    } finally {
      setLoading(false);
    }
  }

  const fetchProfessorEvaluations = async (userId) =>{
    setLoading(true);
    try{
      const res = await getProfessorEvaluations(userId);
      // console.log(res);
      return res.data;
    } catch (err) {
      console.log(err.message);
      setError("Error fetching professor evaluations. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProgressContext.Provider
      value={{
        progressList,
        currentProgress,
        fetchAllProgress,
        fetchProgressById,
        fetchStudentProgress,
        fetchProfessorEvaluations,
        getStudentCourseProgress,
        createProgress,
        addFeedback,
        updateProgress,
        deleteProgress,
        loading,
        error,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export { ProgressProvider, ProgressContext };
