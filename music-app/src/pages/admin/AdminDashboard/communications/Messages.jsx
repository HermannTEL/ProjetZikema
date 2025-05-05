import { useEffect, useRef, useState } from "react";
import { Megaphone, Plus, Trash } from "lucide-react";
import { useNotification, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const SystemMessages = () => {
  const { theme } = useTheme();
  const { createNotification, fetchUserNotifications, deleteNotification } = useNotification();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState({ title: "", message: "", type: "admin_notice" });
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const admin = useRef();

  useEffect(() => {
    if (storedUser) admin.current = storedUser;
  }, [storedUser]);

  const loadMessages = async () => {
    const all = await fetchUserNotifications(admin.current._id);
    const systemMsgs = all.filter((n) => n.type === "admin_notice");
    setMessages(systemMsgs);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleCreate = async () => {
    if (!newMsg.title || !newMsg.message) return;
    await createNotification({ ...newMsg, user: "all" });
    setNewMsg({ title: "", message: "", type: "admin_notice" });
    loadMessages();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    loadMessages();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme) + " flex items-center gap-2"}>
        <Megaphone className="text-orange-500" /> Messages système
      </h2>

      <div className={getThemeClass("bg-white", "bg-gray-900", theme) + " p-4 rounded-xl shadow space-y-3"}>
        <input
          value={newMsg.title}
          onChange={(e) => setNewMsg({ ...newMsg, title: e.target.value })}
          placeholder="Titre du message"
          className={getThemeClass("input-style w-full", "input-style w-full bg-gray-800 text-white border-gray-600", theme)}
        />
        <textarea
          value={newMsg.message}
          onChange={(e) => setNewMsg({ ...newMsg, message: e.target.value })}
          placeholder="Contenu..."
          className={getThemeClass("input-style w-full", "input-style w-full bg-gray-800 text-white border-gray-600", theme)}
          rows={3}
        />
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Publier
        </button>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className={getThemeClass("text-gray-500", "text-gray-400", theme)}>
            Aucun message système disponible.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={getThemeClass("bg-white", "bg-gray-800", theme) + " p-4 rounded-lg shadow-sm flex justify-between"}
            >
              <div>
                <h4 className={getThemeClass("font-semibold text-lg text-orange-600", "font-semibold text-lg text-orange-400", theme)}>
                  {msg.title}
                </h4>
                <p className={getThemeClass("text-sm text-gray-600", "text-sm text-gray-300", theme)}>{msg.message}</p>
              </div>
              <button className="btn-sm btn-danger" onClick={() => handleDelete(msg._id)}>
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SystemMessages;
