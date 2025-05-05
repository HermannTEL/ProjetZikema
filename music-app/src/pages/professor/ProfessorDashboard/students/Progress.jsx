import { useEffect, useState } from "react";
import { BarChart3, CalendarDays, BookOpenText, User } from "lucide-react";
import { useProgress, useUser } from "../../../../utils/hooks";

const StudentProgress = () => {
  const { fetchProfStudents } = useUser();
  const { fetchStudentProgress } = useProgress();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    const profId = JSON.parse(localStorage.getItem("user"))._id;
    fetchProfStudents(profId).then(setStudents);
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentProgress(selectedStudent).then(setProgressList);
    }
  }, [selectedStudent]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">📈 Suivi de progression</h2>

      <div className="mb-4">
        <label className="label">Choisir un élève</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="input-style w-full md:w-1/2"
        >
          <option value="">-- Sélectionner --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.firstname} {s.lastname}
            </option>
          ))}
        </select>
      </div>

      {progressList.length === 0 && selectedStudent && (
        <p className="text-gray-500 dark:text-gray-300">Aucun progrès enregistré pour cet élève.</p>
      )}

      {progressList.length > 0 && (
        <div className="space-y-4">
          {progressList.map((prog, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <BookOpenText className="w-5 h-5" />
                  {prog.course?.title || "Cours inconnu"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> {new Date(prog.evaluationDate).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Technique:</strong> {prog.evaluation?.technique}/10</p>
                <p><strong>Théorie:</strong> {prog.evaluation?.theory}/10</p>
                <p><strong>Musicalité:</strong> {prog.evaluation?.musicality}/10</p>
                <p><strong>Engagement:</strong> {prog.evaluation?.engagement}/10</p>
                <p><strong>Note globale:</strong> {prog.evaluation?.overall}/10</p>
              </div>

              {prog.feedback && (
                <div className="mt-2 text-gray-700 dark:text-gray-200 text-sm">
                  <strong>Feedback:</strong> {prog.feedback}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
