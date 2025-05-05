import { useEffect, useState } from "react";
import { CalendarDays, UserRound, Trash2, FilePlus } from "lucide-react";
import { useUser, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const AbsencesManagement = () => {
  const { fetchProfessors } = useUser();
  const { theme } = useTheme();
  const [professors, setProfessors] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [newAbs, setNewAbs] = useState({
    professorId: "",
    date: "",
    reason: "",
  });

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchProfessors();
      setProfessors(data || []);
    };
    fetch();
  }, []);

  const handleAddAbsence = () => {
    if (!newAbs.professorId || !newAbs.date) return;
    const prof = professors.find(p => p._id === newAbs.professorId);
    const record = {
      id: Date.now(),
      ...newAbs,
      professor: `${prof.firstname} ${prof.lastname}`,
    };
    setAbsences(prev => [...prev, record]);
    setNewAbs({ professorId: "", date: "", reason: "" });
  };

  const handleDelete = (id) => {
    setAbsences(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className={`text-3xl font-bold ${getThemeClass("text-gray-800", "text-white", theme)}`}>
        🚫 Absences professeurs
      </h2>

      {/* Formulaire */}
      <div className={`p-5 rounded-xl shadow space-y-4 ${getThemeClass("bg-white", "bg-gray-800", theme)}`}>
        <h3 className={`text-xl font-semibold ${getThemeClass("text-gray-700", "text-white", theme)}`}>
          Déclarer une absence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="input-style"
            value={newAbs.professorId}
            onChange={(e) => setNewAbs({ ...newAbs, professorId: e.target.value })}
          >
            <option value="">Choisir un professeur</option>
            {professors.map((p) => (
              <option key={p._id} value={p._id}>
                {p.firstname} {p.lastname}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="input-style"
            value={newAbs.date}
            onChange={(e) => setNewAbs({ ...newAbs, date: e.target.value })}
          />
          <input
            className="input-style"
            placeholder="Motif (maladie, congé...)"
            value={newAbs.reason}
            onChange={(e) => setNewAbs({ ...newAbs, reason: e.target.value })}
          />
        </div>
        <button onClick={handleAddAbsence} className="btn-primary flex items-center gap-2">
          <FilePlus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        <h3 className={`text-xl font-semibold ${getThemeClass("text-gray-700", "text-white", theme)}`}>
          📋 Historique des absences
        </h3>
        {absences.length === 0 ? (
          <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>Aucune absence enregistrée.</p>
        ) : (
          absences.map((abs) => (
            <div
              key={abs.id}
              className={`p-4 rounded-xl shadow flex justify-between items-center ${getThemeClass("bg-white", "bg-gray-800", theme)}`}
            >
              <div>
                <p className={`text-sm font-medium ${getThemeClass("text-gray-700", "text-white", theme)}`}>
                  <UserRound className="inline w-4 h-4 mr-1" />
                  {abs.professor}
                </p>
                <p className={getThemeClass("text-sm text-gray-500", "text-gray-300", theme)}>
                  <CalendarDays className="inline w-4 h-4 mr-1" />
                  {new Date(abs.date).toLocaleDateString()} — {abs.reason}
                </p>
              </div>
              <button
                onClick={() => handleDelete(abs.id)}
                className="btn-danger text-xs flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Supprimer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AbsencesManagement;
