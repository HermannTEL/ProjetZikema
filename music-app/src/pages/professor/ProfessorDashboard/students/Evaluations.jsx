import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import { useCourse, useProgress, useUser } from "../../../../utils/hooks";

const StudentEvaluations = () => {
  const { fetchProfStudents } = useUser();
  const { fetchCourseByProf } = useCourse();
  const { createProgress } = useProgress();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    student: "",
    course: "",
    evaluation: {
      technique: 0,
      theory: 0,
      musicality: 0,
      engagement: 0,
      overall: 0
    },
    feedback: "",
    strengths: [],
    areasToImprove: [],
    recommendedExercises: [],
    nextGoals: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const load = async () => {
      const profId = JSON.parse(localStorage.getItem("user"))._id;
      const [studentsData, coursesData] = await Promise.all([
        fetchProfStudents(profId),
        fetchCourseByProf(profId)
      ]);
      setStudents(studentsData || []);
      setCourses(coursesData || []);

      if (searchParams.get("studentId")) {
        setForm((f) => ({ ...f, student: searchParams.get("studentId") }));
      }
    };
    load();
  }, []);

  const handleEvalChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      evaluation: {
        ...form.evaluation,
        [name]: Number(value)
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const profId = localStorage.getItem("userId");
    await createProgress({ ...form, professor: profId });
    setMessage("✅ Évaluation enregistrée !");
    setForm({ ...form, feedback: "" });
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">📊 Évaluation d'un élève</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Élève</label>
            <select
              name="student"
              value={form.student}
              onChange={(e) => setForm({ ...form, student: e.target.value })}
              className="input-style"
              required
            >
              <option value="">Choisir un élève</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.firstname} {s.lastname}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Cours</label>
            <select
              name="course"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="input-style"
              required
            >
              <option value="">Choisir un cours</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["technique", "theory", "musicality", "engagement", "overall"].map((key) => (
            <div key={key}>
              <label className="label capitalize">{key}</label>
              <input
                type="number"
                name={key}
                value={form.evaluation[key]}
                onChange={handleEvalChange}
                min="0"
                max="10"
                className="input-style"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="label">Feedback général</label>
          <textarea
            rows={3}
            value={form.feedback}
            onChange={(e) => setForm({ ...form, feedback: e.target.value })}
            className="input-style"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </button>

        {message && <p className="text-green-600 dark:text-green-400 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default StudentEvaluations;
