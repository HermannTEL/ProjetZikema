import { useEffect, useRef, useState } from "react";
import { UserRound, Music, Phone, ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../../../../utils/hooks";

const AllStudents = () => {
  const { fetchProfStudents } = useUser();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const storedUser  = JSON.parse(localStorage.getItem('user'));

  const professor = useRef();

  useEffect(() => {
      if (storedUser ) {
          professor.current = storedUser ;
      }
  }, [storedUser ]);

  useEffect(() => {
    const fetchStudents = async () => {
      const profId = professor.current._id;
      const res = await fetchProfStudents(profId);
      setStudents(res || []);
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.firstname?.toLowerCase().includes(search.toLowerCase()) ||
      s.lastname?.toLowerCase().includes(search.toLowerCase()) ||
      s.preferredInstruments?.join(",").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">👨‍🎓 Mes élèves</h2>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un élève ou instrument"
        className="w-full md:w-1/2 px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border dark:border-gray-600"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((student) => (
          <div
            key={student._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 space-y-2"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {student.firstname} {student.lastname}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <UserRound className="w-4 h-4" /> {student.studentType} — {student.level}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Music className="w-4 h-4" /> {student.preferredInstruments?.join(", ") || "Non précisé"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Phone className="w-4 h-4" /> {student.phone || "Non précisé"}
            </p>
            <div className="pt-2">
              <Link
                to={`/prof/students/evaluations?studentId=${student._id}`}
                className="btn-primary inline-flex items-center gap-1 text-sm"
              >
                Suivi / Évaluation <ArrowRightCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllStudents;
