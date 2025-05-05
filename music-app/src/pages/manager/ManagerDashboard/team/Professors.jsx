import { useEffect, useState } from "react";
import { CalendarCheck2, Phone, Mail, Music, UserCircle2 } from "lucide-react";
import { useUser, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const ProfessorsManagement = () => {
  const { fetchProfessors } = useUser();
  const { theme } = useTheme();
  const [profs, setProfs] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const list = await fetchProfessors();
      setProfs(list || []);
    };
    fetch();
  }, []);

  const filtered = profs.filter((p) => {
    return (
      !filter ||
      p.instruments?.some((instr) => instr.toLowerCase().includes(filter.toLowerCase())) ||
      p.expertise?.some((exp) => exp.toLowerCase().includes(filter.toLowerCase()))
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={`text-3xl font-bold ${getThemeClass("text-gray-800", "text-white", theme)}`}>
        👨‍🏫 Professeurs du centre
      </h2>

      <input
        className="input-style w-full max-w-md"
        placeholder="Filtrer par instrument ou spécialité..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>
            Aucun professeur ne correspond.
          </p>
        ) : (
          filtered.map((p, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl shadow flex flex-col gap-2 ${getThemeClass("bg-white", "bg-gray-800", theme)}`}
            >
              <div className="flex items-center gap-4">
                {p.profileImage ? (
                  <img src={p.profileImage} alt={p.firstname} className="w-16 h-16 rounded-full" />
                ) : (
                  <UserCircle2 className="w-16 h-16 text-gray-400" />
                )}
                <div>
                  <h3 className={getThemeClass("text-lg font-semibold text-gray-800", "text-white", theme)}>
                    {p.firstname} {p.lastname}
                  </h3>
                  <p className={getThemeClass("text-sm text-gray-500", "text-gray-300", theme)}>
                    {p.expertise?.join(", ")}
                  </p>
                </div>
              </div>
              <p className={getThemeClass("text-sm text-gray-600", "text-gray-300", theme)}>
                <Music className="inline w-4 h-4 mr-1" /> Instruments : {p.instruments?.join(", ") || "N/A"}
              </p>
              <p className={getThemeClass("text-sm text-gray-600", "text-gray-300", theme)}>
                <CalendarCheck2 className="inline w-4 h-4 mr-1" /> Jours dispo :
                {p.availability?.map((a) => ` ${a.day}`).join(", ") || " Non défini"}
              </p>
              <p className={getThemeClass("text-sm text-gray-600", "text-gray-300", theme)}>
                💶 Tarif : {p.hourlyRate ? `${p.hourlyRate} € / h` : "Non défini"}
              </p>
              <p className={getThemeClass("text-sm text-gray-600", "text-gray-300", theme)}>
                <Phone className="inline w-4 h-4 mr-1" /> {p.phone || "Non renseigné"}
              </p>
              <p className={getThemeClass("text-sm text-gray-600", "text-gray-300", theme)}>
                <Mail className="inline w-4 h-4 mr-1" /> {p.email}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfessorsManagement;
