import { useEffect, useState } from "react";
import {
  CircleCheck, CircleX, Mail, Shield, Pencil, Trash2,
  LayoutList, LayoutGrid, Search, Filter, AlertCircle,
  UserCog2,
  Music
} from "lucide-react";
import { useUser, useTheme, useToast } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";
import UserProfileEditor from "../../../Profile";
import { Button, RoleBadge, StatusBadge } from "../../../../components/ui";

const UserManager = () => {
  const { userList, fetchAllUsers, toggleUserStatus, deleteUser } = useUser();
  const { theme } = useTheme();
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [view, setView] = useState(() => localStorage.getItem("userView") || "table");
  const [loading, setLoading] = useState(true);
  const [statusChanging, setStatusChanging] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [displayProfile, setDisplayProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const isDark = theme === "dark";
  const bgMain = getThemeClass("bg-gray-50", "bg-gray-900", theme);
  const textMain = getThemeClass("text-gray-800", "text-white", theme);
  const bgCard = getThemeClass("bg-white", "bg-gray-800", theme);
  const bgHeader = getThemeClass("bg-white/90", "bg-gray-800/80", theme);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await fetchAllUsers();
        // console.log("Users from User manager: ", userList);
        if (res || userList) {
          setUsers(res || userList);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCreate = () => {
    setSelectedUserId(null);
    setConfirmDelete(null);
    setDisplayProfile(true);
  };  

  const handleToggle = async (id) => {
    try {
      setStatusChanging(id);
      await toggleUserStatus(id);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u))
      );
      toast({
        title: "Succès",
        description: "Le statut a été mis à jour.",
        type: "success",
      });
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut.",
        variant: "destructive",
      });
    } finally {
      setStatusChanging(null);
    }
  };

  const handleEdit = (user) => {
    setSelectedUserId(user._id);
    setDisplayProfile(true);
    setConfirmDelete(null);
  };

  const refreshUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchAllUsers();
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Erreur de rafraîchissement:", error);
    } finally {
      setLoading(false);
    }
  };  

  const confirmDeleteUser = (user) => {
    setConfirmDelete(user);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      const res = await deleteUser(confirmDelete._id);
      if (res.success) {
        toast({
          title: "Suppression réussie",
          description: `${confirmDelete.firstname} ${confirmDelete.lastname} a été supprimé.`,
          type: "success",
        });
        setUsers((prev) => prev.filter(u => u._id !== confirmDelete._id));
        setConfirmDelete(null);
      } else {
        console.error("Erreur suppression:", res.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (confirmDelete) {
    handleDelete(confirmDelete._id);
    toast({
      title: "Suppression réussie",
      description: `${confirmDelete.firstname} ${confirmDelete.lastname} a été supprimé.`,
      type: "success",
    });
  }
  
  

  const filtered = users.filter(
    (u) =>
      (!roleFilter || u.role === roleFilter) &&
      (`${u.firstname} ${u.lastname}`.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const roles = ["student", "professor", "manager", "admin"];

  const changeView = (v) => {
    setView(v);
    localStorage.setItem("userView", v);
  };

  return (
    <>
      {displayProfile && selectedUserId ? (
        <UserProfileEditor
          userId={selectedUserId}
          onClose={async () => {
            setDisplayProfile(false);
            await refreshUsers();
          }}
        />
      ) : (
        <div className={`min-h-screen ${bgMain} ${textMain}`}>
          {/* En-tête */}
          <div className={`sticky top-0 z-10 ${bgHeader} backdrop-blur-sm shadow-md`}>
            <div className="p-4 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <UserCog2 /> Gestion des utilisateurs
              </h2>
              <div className="flex items-center gap-3">
              <Button
                onClick={() => handleCreate()}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg ml-4"
              >
                + Nouvel utilisateur
              </Button>

                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button onClick={() => changeView("table")} className={`p-2 ${view === "table" ? "bg-blue-200" : ""}`}>
                    <LayoutList />
                  </button>
                  <button onClick={() => changeView("card")} className={`p-2 ${view === "card" ? "bg-blue-200" : ""}`}>
                    <LayoutGrid />
                  </button>
                </div>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="p-4 max-w-7xl mx-auto flex flex-wrap gap-4">
              <div className="flex-1 min-w-72 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
                  } focus:outline-none`}
                  placeholder="Recherche..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  className={`pl-10 pr-8 py-2 rounded-lg border appearance-none ${
                    isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
                  } focus:outline-none`}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">Tous les rôles</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-4 max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className={`rounded-xl ${bgCard} p-12 text-center`}>
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium">Aucun utilisateur trouvé</h3>
              </div>
            ) : view === "table" ? (
              <div className={`${bgCard} rounded-xl shadow overflow-x-auto`}>
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left">Nom</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Rôle</th>
                      <th className="px-4 py-3 text-left">Statut</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((user) => (
                      <tr key={user._id} className="border-t">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <img
                            src={user.profileImage || "/default-avatar.png"}
                            alt={`Avatar de ${user.firstname} ${user.lastname}`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span>{user.firstname} {user.lastname}</span>
                        </td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3"><RoleBadge role={user.role} isDark={isDark} /></td>
                        <td className="px-4 py-3"><StatusBadge isActive={user.isActive} isDark={isDark} /></td>
                        <td className="px-4 py-3 flex justify-end items-center gap-2">
                          <button onClick={() => handleEdit(user)} title="Modifier">
                            <Pencil className="w-5 h-5 text-blue-500" />
                          </button>
                          <button onClick={() => confirmDeleteUser(user)} title="Supprimer">
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                          <button
                            onClick={() => handleToggle(user._id)}
                            className="px-3 py-1 rounded-full text-xs"
                          >
                            {statusChanging === user._id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                            ) : user.isActive ? "Désactiver" : "Activer"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // affichage card
              <div className="text-center mt-10 text-gray-400">
                {view === "card" && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((user) => (
                      <div key={user._id} className={`${bgCard} rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg`}>
                        <div className={`p-1 ${
                          user.role === "admin" ? "bg-red-500" :
                          user.role === "manager" ? "bg-amber-500" :
                          user.role === "professor" ? "bg-purple-500" :
                          "bg-blue-500"
                        }`} />
                        <div className="p-5">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3 mb-2">
                              <img
                                src={user.profileImage || "/default-avatar.png"}
                                alt={user.firstname}
                                className="w-10 h-10 rounded-full object-cover border"
                                onError={(e) => (e.target.src = "/default-avatar.png")}
                              />
                              <h3 className="text-lg font-semibold">
                                {user.firstname} {user.lastname}
                              </h3>
                            </div>
                            <StatusBadge isActive={user.isActive} />
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <div className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                              <Mail className="w-4 h-4 mr-2" />
                              <span className="text-sm truncate">{user.email}</span>
                            </div>
                            
                            <div className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                              <Shield className="w-4 h-4 mr-2" />
                              <RoleBadge role={user.role} />
                            </div>
                            
                            {user.instruments && user.instruments.length > 0 && (
                              <div className={`flex items-start ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                <Music className="w-4 h-4 mr-2 mt-0.5" />
                                <span className="text-sm">{user.instruments.join(", ")}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 pt-3 border-t flex justify-between items-center">
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => handleEdit(user)}
                                className={`p-2 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                title="Modifier"
                              >
                                <Pencil className="w-4 h-4 text-blue-500" />
                              </button>
                              <button 
                                onClick={() => confirmDeleteUser(user)}
                                className={`p-2 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleToggle(user._id)}
                              className={`py-1 px-3 rounded-full text-xs font-medium flex items-center gap-1 ${
                                user.isActive 
                                  ? isDark ? "bg-red-900/30 text-red-300 hover:bg-red-800/50" 
                                          : "bg-red-50 text-red-600 hover:bg-red-100" 
                                  : isDark ? "bg-green-900/30 text-green-300 hover:bg-green-800/50" 
                                          : "bg-green-50 text-green-600 hover:bg-green-100"
                              }`}
                            >
                              {user.isActive 
                                ? <><CircleX className="w-3 h-3" /> Désactiver</> 
                                : <><CircleCheck className="w-3 h-3" /> Activer</>
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserManager;
