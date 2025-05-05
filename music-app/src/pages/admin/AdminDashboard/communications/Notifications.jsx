import { useEffect, useRef, useState } from "react";
import { Bell, Trash2, Send } from "lucide-react";
import { useNotification, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const NotificationsContent = () => {
  const { theme } = useTheme();
  const { createNotification, fetchUserNotifications, deleteNotification } = useNotification();
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const admin = useRef();

  useEffect(() => {
    if (storedUser) admin.current = storedUser;
  }, [storedUser]);

  const loadData = async () => {
    const res = await fetchUserNotifications(admin.current._id);
    setNotifications(res || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSend = async () => {
    if (!title || !message) return;
    await createNotification({ title, message, user: "all" });
    setTitle("");
    setMessage("");
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    loadData();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme) + " flex items-center gap-2"}>
        <Bell className="text-yellow-500" /> Notifications
      </h2>

      <div className={getThemeClass("bg-white", "bg-gray-900", theme) + " p-4 rounded-xl shadow space-y-4"}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la notification"
          className={getThemeClass("input-style w-full", "input-style w-full bg-gray-800 text-white border-gray-600", theme)}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Contenu du message..."
          rows={4}
          className={getThemeClass("input-style w-full", "input-style w-full bg-gray-800 text-white border-gray-600", theme)}
        />
        <button onClick={handleSend} className="btn-primary">
          <Send className="w-4 h-4 mr-1" /> Envoyer
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>Chargement...</p>
        ) : notifications.length === 0 ? (
          <p className={getThemeClass("text-gray-400", "text-gray-500", theme)}>Aucune notification disponible.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={getThemeClass("bg-white", "bg-gray-800", theme) + " p-4 rounded-xl shadow-sm flex justify-between items-start"}
            >
              <div>
                <h4 className={getThemeClass("font-semibold text-lg text-gray-800", "font-semibold text-lg text-white", theme)}>
                  {notif.title}
                </h4>
                <p className={getThemeClass("text-sm text-gray-600", "text-sm text-gray-300", theme)}>
                  {notif.message}
                </p>
              </div>
              <button onClick={() => handleDelete(notif._id)} className="btn-sm btn-danger ml-4">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsContent;
