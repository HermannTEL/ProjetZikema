import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useUser, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const Roles = () => {
  const { userList, fetchAllUsers, updateUser } = useUser();
  const { theme } = useTheme();

  const [users, setUsers] = useState([]);
  const [modifiedRoles, setModifiedRoles] = useState({});

  const roles = ["student", "professor", "manager", "admin"];

  const fetchUsers = async () => {
    const all = await fetchAllUsers();
    setUsers(all || userList || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []); // ✅ Charger 1 seule fois au départ

  const handleChange = (userId, newRole) => {
    setModifiedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleSave = async (userId) => {
    const updatedRole = modifiedRoles[userId];
    if (!updatedRole) return;

    try {
      await updateUser(userId, { role: updatedRole });

      // ✅ Mise à jour immédiate de users sans fetchAllUsers
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: updatedRole } : user
        )
      );

      // ✅ Nettoyage du rôle modifié
      setModifiedRoles((prev) => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
        Gestion des rôles
      </h2>

      <div className={getThemeClass("overflow-x-auto bg-white shadow rounded-xl", "overflow-x-auto bg-gray-900 shadow rounded-xl", theme)}>
        <table className="w-full text-sm text-left">
          <thead className={getThemeClass("text-xs text-gray-600 border-b", "text-xs text-gray-400 border-b border-gray-700", theme)}>
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rôle actuel</th>
              <th className="p-3">Changer pour</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className={getThemeClass("border-b", "border-b border-gray-800 text-blue-50", theme)}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.profileImage || "/default-avatar.png"}
                      alt={`${u.firstname} ${u.lastname}`}
                      className="w-8 h-8 rounded-full object-cover border"
                      onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                    />
                    <span>{u.firstname} {u.lastname}</span>
                  </div>
                </td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td> {/* ✅ Affiche directement le rôle modifié */}
                <td className="p-3">
                  <select
                    value={modifiedRoles[u._id] || u.role}
                    onChange={(e) => handleChange(u._id, e.target.value)}
                    className={getThemeClass("input-style", "input-style bg-gray-800 text-white border-gray-600", theme)}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleSave(u._id)}
                    disabled={!(modifiedRoles[u._id] && modifiedRoles[u._id] !== u.role)}
                    className="btn-sm btn-primary flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" /> Enregistrer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roles;
