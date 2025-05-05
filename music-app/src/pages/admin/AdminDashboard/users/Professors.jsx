import { useEffect, useState } from "react";
import { BadgeCheck, Ban, Music, CheckCircle, XCircle } from "lucide-react";
import { useUser, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const Professors = () => {
  const { fetchAllUsers, toggleUserStatus } = useUser();
  const { theme } = useTheme();

  const [professors, setProfessors] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const users = await fetchAllUsers();
      const profs = users?.filter((u) => u.role === "professor") || [];
      setProfessors(profs);
    };
    fetch();
  }, []);

  const filtered = professors.filter(
    (p) =>
      !filter ||
      p.instruments?.some((i) =>
        i.toLowerCase().includes(filter.toLowerCase())
      )
  );

  const handleToggleStatus = async (id) => {
    await toggleUserStatus(id);
    setProfessors((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, isActive: !p.isActive } : p
      )
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
        👨‍🏫 Professeurs
      </h2>

      <input
        className={getThemeClass("input-style max-w-md bg-blue-200 text-slate-800 border-blue-50", "input-style max-w-md bg-gray-800 text-white border-gray-600", theme)}
        placeholder="Filtrer par instrument (piano, guitare...)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>Aucun professeur trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div
              key={p._id}
              className={getThemeClass("bg-white p-4 rounded-xl shadow", "bg-gray-800 p-4 rounded-xl shadow", theme) + " flex flex-col gap-2"}
            >
              <h3 className={getThemeClass("text-lg font-semibold text-gray-800", "text-lg font-semibold text-white", theme) + " flex items-center gap-2"}>
                <BadgeCheck className="w-5 h-5 text-blue-500" />
                {p.firstname} {p.lastname}
              </h3>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                <Music className="inline w-4 h-4 mr-1" /> Instruments : {p.instruments?.join(", ") || "Aucun renseigné"}
              </p>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                🎼 Expertises : {p.expertise?.join(", ") || "Non spécifiées"}
              </p>
              <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                📍 Ville : {p.address?.city || "Non renseignée"}
              </p>
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  p.isActive
                    ? getThemeClass("bg-green-100 text-green-700", "bg-green-900 text-green-100", theme)
                    : getThemeClass("bg-red-100 text-red-700", "bg-red-900 text-red-100", theme)
                }`}>
                  {p.isActive ? "Actif" : "Inactif"}
                </span>
                <button
                  className={`text-xs px-2 py-2 rounded-full ${p.isActive ? `${getThemeClass("bg-red-200 text-red-700", "bg-red-900 text-red-300", theme)}` : `${getThemeClass("bg-blue-200 text-blue-700", "bg-blue-900 text-blue-200", theme)}`} flex items-center gap-1`}
                  onClick={() => handleToggleStatus(p._id)}
                >
                  {p.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  {p.isActive ? "Désactiver" : "Activer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Professors;
