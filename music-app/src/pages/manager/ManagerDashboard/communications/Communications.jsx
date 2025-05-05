import { useEffect, useRef, useState } from "react";
import { Bell, Trash, Check, AlarmClock } from "lucide-react";
import { useNotification, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const ManagerCommunications = () => {
  const { fetchUserNotifications, markAsRead, deleteNotification } = useNotification();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("");
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const manager = useRef();

  useEffect(() => {
    if (storedUser) {
      manager.current = storedUser;
    }
  }, [storedUser]);

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchUserNotifications(manager.current._id);
      setNotifications(res || []);
    };
    fetch();
  }, []);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const filtered = notifications.filter(
    (n) => !filter || n.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
        📢 Centre de communication
      </h2>

      <input
        className="input-style w-full max-w-md"
        placeholder="Filtrer par type (rappel, paiement, etc.)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>Aucune notification trouvée.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((notif) => (
            <div
              key={notif._id}
              className={getThemeClass(
                `p-4 rounded-xl shadow flex justify-between items-start ${
                  !notif.isRead ? "border-l-4 border-blue-500" : ""
                }`,
                `bg-gray-800 p-4 rounded-xl shadow flex justify-between items-start ${
                  !notif.isRead ? "border-l-4 border-blue-500" : ""
                }`,
                theme,
                "bg-white"
              )}
            >
              <div>
                <p className={getThemeClass("text-lg font-semibold text-gray-800 flex items-center gap-2", "text-lg font-semibold text-white flex items-center gap-2", theme)}>
                  <Bell className="w-5 h-5" />
                  {notif.title}
                </p>
                <p className={getThemeClass("text-sm text-gray-600 mt-1", "text-sm text-gray-300 mt-1", theme)}>
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  <AlarmClock className="inline w-3 h-3 mr-1" />
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="btn-primary px-2 py-1 text-sm flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Lu
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notif._id)}
                  className="btn-danger px-2 py-1 text-sm flex items-center gap-1"
                >
                  <Trash className="w-4 h-4" /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerCommunications;
