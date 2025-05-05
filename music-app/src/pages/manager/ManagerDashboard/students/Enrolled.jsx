import { useEffect, useState } from "react";
import { GraduationCap, Mail, Music, Phone, UserRound } from "lucide-react";
import { useEnrollment, useUser, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const EnrolledStudents = () => {
  const { fetchAllUsers } = useUser();
  const { fetchAllEnrollments } = useEnrollment();
  const { theme } = useTheme();
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [filter, setFilter] = useState({ level: "", type: "", instrument: "" });

  useEffect(() => {
    const fetch = async () => {
      const users = await fetchAllUsers();
      const enrolled = await fetchAllEnrollments();

      const filtered = users?.filter((u) => u.role === "student");
      setStudents(filtered || []);
      setEnrollments(enrolled || []);
    };
    fetch();
  }, []);

  const enriched = students.map((student) => {
    const enrollment = enrollments.find((e) => e.student === student._id);
    return {
      ...student,
      lastEnrollment: enrollment?.enrolledAt,
      course: enrollment?.course?.title,
    };
  });

  const filtered = enriched.filter((s) => {
    return (
      (!filter.level || s.level === filter.level) &&
      (!filter.type || s.studentType === filter.type) &&
      (!filter.instrument || s.preferredInstruments?.includes(filter.instrument))
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-gray-800", "text-white", theme) + " text-3xl font-bold"}>🎓 Élèves inscrits</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="input-style"
          value={filter.level}
          onChange={(e) => setFilter({ ...filter, level: e.target.value })}
        >
          <option value="">Niveau</option>
          <option value="Débutant">Débutant</option>
          <option value="Intermédiaire">Intermédiaire</option>
          <option value="Avancé">Avancé</option>
        </select>
        <select
          className="input-style"
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
        >
          <option value="">Type</option>
          <option value="regular">Régulier</option>
          <option value="occasional">Occasionnel</option>
          <option value="online-only">En ligne</option>
        </select>
        <input
          className="input-style"
          placeholder="Instrument préféré"
          value={filter.instrument}
          onChange={(e) => setFilter({ ...filter, instrument: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>
            Aucun élève trouvé.
          </p>
        ) : (
          filtered.map((s, i) => (
            <div
              key={i}
              className={getThemeClass("bg-white", "bg-gray-800", theme) + " p-5 rounded-xl shadow flex justify-between items-start"}
            >
              <div>
                <p className={getThemeClass("text-gray-800", "text-white", theme) + " text-lg font-semibold"}>
                  <UserRound className="inline w-5 h-5 mr-1" />
                  {s.firstname} {s.lastname}
                </p>
                <p className={getThemeClass("text-gray-600", "text-gray-300", theme) + " text-sm"}>
                  <GraduationCap className="inline w-4 h-4 mr-1" /> {s.level || "N/A"} | Type : {s.studentType}
                </p>
                <p className={getThemeClass("text-gray-600", "text-gray-300", theme) + " text-sm"}>
                  <Music className="inline w-4 h-4 mr-1" /> {s.preferredInstruments?.join(", ") || "Aucun"}
                </p>
                <p className={getThemeClass("text-gray-600", "text-gray-300", theme) + " text-sm"}>
                  <Mail className="inline w-4 h-4 mr-1" /> {s.email}
                </p>
                <p className={getThemeClass("text-gray-600", "text-gray-300", theme) + " text-sm"}>
                  <Phone className="inline w-4 h-4 mr-1" /> {s.phone || "Non renseigné"}
                </p>
              </div>
              <div className={getThemeClass("text-gray-500", "text-gray-300", theme) + " text-sm text-right"}>
                <p>Cours actuel : {s.course || "Non assigné"}</p>
                <p>Inscrit le : {s.lastEnrollment ? new Date(s.lastEnrollment).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnrolledStudents;