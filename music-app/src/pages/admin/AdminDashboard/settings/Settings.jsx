import { useState } from "react";
import { Settings, Save } from "lucide-react";
import { useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const SettingsContent = () => {
  const { theme, toggleTheme } = useTheme();

  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    sms: false,
    reminder: 24,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationPrefs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSave = () => {
    console.log("Paramètres enregistrés :", notificationPrefs);
    // Optionnel : envoyer au backend
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme) + " flex items-center gap-2"}>
        <Settings className="text-gray-500" /> Paramètres généraux
      </h2>

      <div className={getThemeClass("bg-white p-6 rounded-xl shadow space-y-6", "bg-gray-900 p-6 rounded-xl shadow space-y-6", theme)}>

        {/* Thème */}
        <div className="space-y-2">
          <h4 className={getThemeClass("font-semibold text-gray-700", "font-semibold text-white", theme)}>Thème de l'application</h4>
          <button onClick={toggleTheme} className="btn-primary">
            Passer en {theme === "light" ? "sombre" : "clair"}
          </button>
        </div>

        {/* Notifications */}
        <div className="space-y-2">
          <h4 className={getThemeClass("font-semibold text-gray-700", "font-semibold text-white", theme)}>Préférences notifications</h4>
          <label className={getThemeClass("flex items-center gap-3 text-gray-700", "flex items-center gap-3 text-gray-300", theme)}>
            <input
              type="checkbox"
              name="email"
              checked={notificationPrefs.email}
              onChange={handleChange}
            />
            Notifications par email
          </label>
          <label className={getThemeClass("flex items-center gap-3 text-gray-700", "flex items-center gap-3 text-gray-300", theme)}>
            <input
              type="checkbox"
              name="sms"
              checked={notificationPrefs.sms}
              onChange={handleChange}
            />
            Notifications par SMS
          </label>
        </div>

        {/* Rappel */}
        <div className="space-y-2">
          <h4 className={getThemeClass("font-semibold text-gray-700", "font-semibold text-white", theme)}>Rappel avant les cours</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="reminder"
              value={notificationPrefs.reminder}
              onChange={handleChange}
              className={getThemeClass("input-style w-24", "input-style w-24 bg-gray-800 text-white border-gray-600", theme)}
              min={1}
            />
            <span className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-400", theme)}>heures</span>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default SettingsContent;
