import { useEffect, useState } from "react";
import { BadgeCheck, Ban, Eye } from "lucide-react";
import { useUser, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";
import UserProfileEditor from "../../../Profile";

const Managers = () => {
  const { fetchAllUsers, toggleUserStatus } = useUser();
  const { theme } = useTheme();

  const [managers, setManagers] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayProfile, setDisplayProfile] = useState(false);
  

  const fetchData = async () => {
    const users = await fetchAllUsers();
    const filtered = users?.filter((u) => u.role === "manager");
    setManagers(filtered || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (id) => {
    await toggleUserStatus(id);
    fetchData();
  };

  const displayUserProfile = (id) => {
    // console.log("Display profile for student with ID:", id);
    setSelectedManagerId(id);
    setDisplayProfile(true);
  }

  return (
    <>
      {displayProfile ? (
        <UserProfileEditor
          userId={selectedManagerId}
          onClose={() => setDisplayProfile(false)}
        />
      ) : (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
            Gestionnaires de centres
          </h2>

          {loading ? (
            <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>
              Chargement des managers...
            </p>
          ) : (
            <div className={getThemeClass("overflow-x-auto bg-white shadow rounded-xl", "overflow-x-auto bg-gray-900 shadow rounded-xl", theme)}>
              <table className="w-full text-sm text-left">
                <thead className={getThemeClass("text-xs text-gray-600 border-b", "text-xs text-gray-400 border-b border-gray-700", theme)}>
                  <tr>
                    <th className="p-3">Nom</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Téléphone</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager) => (
                    <tr key={manager._id} className={getThemeClass("border-b", "border-b border-gray-800 text-blue-50", theme)}>
                      <td className="p-3">
                        {manager.firstname} {manager.lastname}
                      </td>
                      <td className="p-3">{manager.email}</td>
                      <td className="p-3">{manager.phone || "—"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          manager.isActive
                            ? getThemeClass("bg-green-100 text-green-700", "bg-green-900 text-green-100", theme)
                            : getThemeClass("bg-red-100 text-red-700", "bg-red-900 text-red-100", theme)
                        }`}>
                          {manager.isActive ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button 
                          onClick={() => displayUserProfile(manager._id)}
                          className={`btn-sm btn-outline ${getThemeClass("text-blue-700", "text-blue-300", theme)}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggle(manager._id)}
                          className={`btn-sm ${
                            manager.isActive ? "btn-danger" : "btn-success"
                          }`}
                        >
                          {manager.isActive ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <BadgeCheck className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Managers;
