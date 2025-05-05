import { useEffect, useState } from "react";
import { Upload, Send } from "lucide-react";
import { useCourse, useUser } from "../../../../utils/hooks";

const ShareResources = () => {
  const { fetchCourseByProf } = useCourse();
  const { fetchProfStudents } = useUser();

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    courseId: "",
    studentId: "all",
    title: "",
    type: "pdf",
    url: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const profId = JSON.parse(localStorage.getItem("user"))._id;
    fetchCourseByProf(profId).then(setCourses);
    fetchProfStudents(profId).then(setStudents);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simuler enregistrement / notification
    console.log("Ressource partagée :", form);
    setMessage("✅ Ressource partagée !");
    setForm({ ...form, title: "", url: "" });
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">📤 Partager une ressource</h2>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
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

          <select
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            className="input-style"
          >
            <option value="all">Tous les élèves</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.firstname} {s.lastname}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Titre de la ressource"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input-style"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="input-style"
          >
            <option value="pdf">PDF</option>
            <option value="audio">Audio</option>
            <option value="video">Vidéo</option>
            <option value="link">Lien</option>
          </select>

          <input
            type="url"
            placeholder="Lien ou URL de la ressource"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="input-style"
            required
          />
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2">
          <Send className="w-4 h-4" /> Partager
        </button>

        {message && <p className="text-green-600 dark:text-green-400 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default ShareResources;
