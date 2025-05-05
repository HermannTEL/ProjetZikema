import { useEffect, useState } from "react";
import { UserRound, CheckCircle2, XCircle, CalendarDays, Music, GraduationCap } from "lucide-react";
import { getThemeClass } from "../../../../utils/functions";

const StudentRequestsManager = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Simulation des demandes fictives à remplacer par une requête backend future
    setRequests([
      {
        id: 1,
        firstname: "Lucie",
        lastname: "Durand",
        level: "Débutant",
        preferredInstruments: ["Piano"],
        requestedAt: new Date(),
        email: "lucie@email.com",
      },
      {
        id: 2,
        firstname: "Ali",
        lastname: "Ben",
        level: "Intermédiaire",
        preferredInstruments: ["Guitare"],
        requestedAt: new Date(),
        email: "ali@email.com",
      },
    ]);
  }, []);

  const handleAccept = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    // Action réelle d’enregistrement via API
  };

  const handleReject = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    // Action réelle de suppression/refus via API
  };

  const filtered = requests.filter(r =>
    !filter ||
    r.preferredInstruments.some(instr => instr.toLowerCase().includes(filter.toLowerCase())) ||
    r.level.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">📥 Demandes d’élèves</h2>

      <input
        className="input-style w-full max-w-md"
        placeholder="Filtrer par instrument ou niveau..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className={getThemeClass("text-gray-500", "text-gray-300")}>Aucune demande à afficher.</p>
      ) : (
        filtered.map((r) => (
          <div
            key={r.id}
            className={getThemeClass("bg-white", "bg-gray-800") + " p-5 rounded-xl shadow flex justify-between items-center"}
          >
            <div>
              <p className={getThemeClass("text-lg font-bold text-gray-800", "text-white")}> 
                <UserRound className="inline w-5 h-5 mr-2" />
                {r.firstname} {r.lastname}
              </p>
              <p className={getThemeClass("text-sm text-gray-600", "text-gray-300")}> 
                <Music className="inline w-4 h-4 mr-1" /> Instruments souhaités : {r.preferredInstruments.join(", ")}
              </p>
              <p className={getThemeClass("text-sm text-gray-600", "text-gray-300")}> 
                <GraduationCap className="inline w-4 h-4 mr-1" /> Niveau : {r.level}
              </p>
              <p className={getThemeClass("text-sm text-gray-600", "text-gray-300")}> 
                <CalendarDays className="inline w-4 h-4 mr-1" /> Demandé le : {new Date(r.requestedAt).toLocaleDateString()}
              </p>
              <p className={getThemeClass("text-sm text-gray-600", "text-gray-300")}>📧 {r.email}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(r.id)}
                className="btn-primary flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" /> Accepter
              </button>
              <button
                onClick={() => handleReject(r.id)}
                className="btn-danger flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Refuser
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentRequestsManager;
