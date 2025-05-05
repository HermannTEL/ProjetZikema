// src/layout/Topbar.jsx
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "../../components/ui/ThemeSwitcher";
import { useAuth } from "../../utils/hooks";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md px-4 py-2 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl font-semibold text-blue-600 dark:text-white">🎵 ZikEma</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-200">
          Connecté : {user?.email}
        </span>
        <ThemeSwitcher/>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Topbar;
