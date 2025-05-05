import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../../../utils/hooks";
import { Select, SelectItem } from "../../../../components/ui"; // ✅ Utilisation de ton système UI

const ProfessorsList = () => {
  const { fetchProfessors } = useUser();
  const [professors, setProfessors] = useState([]);
  const [filter, setFilter] = useState({ instrument: "", expertise: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const profs = await fetchProfessors();
        setProfessors(profs || []);
      } catch (error) {
        console.error("Erreur lors du chargement des professeurs :", error);
      }
    };
    load();
  }, []); // ✅ Important pour éviter un chargement infini

  const instruments = [...new Set(professors.flatMap(p => p.instruments || []))];
  const expertises = [...new Set(professors.flatMap(p => p.expertise || []))];

  const filtered = professors.filter(p =>
    (!filter.instrument || p.instruments?.includes(filter.instrument)) &&
    (!filter.expertise || p.expertise?.includes(filter.expertise))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">🎓 Professeurs disponibles</h2>

      {/* Filtres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Select value={filter.instrument} onValueChange={(val) => setFilter(f => ({ ...f, instrument: val }))}>
          <SelectItem value="">🎸 Tous les instruments</SelectItem>
          {instruments.map((i, idx) => (
            <SelectItem key={idx} value={i}>{i}</SelectItem>
          ))}
        </Select>

        <Select value={filter.expertise} onValueChange={(val) => setFilter(f => ({ ...f, expertise: val }))}>
          <SelectItem value="">🎶 Toutes les spécialités</SelectItem>
          {expertises.map((x, idx) => (
            <SelectItem key={idx} value={x}>{x}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prof) => (
          <div key={prof._id} className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden flex flex-col">
            <img
              src={prof.profileImage || "/img/prof-default.jpg"}
              alt={prof.firstname}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{prof.firstname} {prof.lastname}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">{prof.address?.city}, {prof.address?.country}</p>
                <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">
                  Instruments : <strong>{(prof.instruments || []).join(", ")}</strong>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Styles : <strong>{(prof.expertise || []).join(", ")}</strong>
                </p>
                <p className="text-sm text-blue-700 font-semibold mt-1">
                  Tarif : {prof.hourlyRate ? `${prof.hourlyRate} €/h` : "Non précisé"}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Link
                  to={`/student/catalog/courses?prof=${prof._id}`}
                  className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                >
                  Voir ses cours →
                </Link>
                <Link
                  to={`/student/profile/${prof._id}`}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Voir profil
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 mt-4">
          Aucun professeur ne correspond à votre recherche.
        </p>
      )}
    </div>
  );
};

export default ProfessorsList;
