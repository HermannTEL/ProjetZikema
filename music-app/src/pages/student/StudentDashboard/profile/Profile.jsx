import { useEffect, useState } from "react";
import { Loader2, Save, UserCircle2 } from "lucide-react";
import { useUser } from "../../../../utils/hooks";

const StudentProfileContent = () => {
  const { fetchCurrentUser, updateMe } = useUser();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchCurrentUser();
      setProfile(data);
      setFormData(data);
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("notificationPreferences")) {
      setFormData((prev) => ({
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          [name.split(".")[1]]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateMe(profile._id, formData);
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">👤 Mon profil</h2>

      {!profile ? (
        <div className="flex justify-center"><Loader2 className="animate-spin h-6 w-6" /></div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-center gap-4">
            <img
              src={profile.profileImage || "/placeholder-avatar.png"}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-lg text-gray-800 dark:text-white">{profile.firstname} {profile.lastname}</p>
              <p className="text-gray-500 dark:text-gray-300 text-sm">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Téléphone: </label>
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="input-style"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Instrument préféré: </label>
              <input
                name="preferredInstruments"
                value={formData.preferredInstruments?.[0] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, preferredInstruments: [e.target.value] })
                }
                className="input-style"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Niveau: </label>
              <select
                name="level"
                value={formData.level || ""}
                onChange={handleChange}
                className="input-style"
              >
                <option>Débutant</option>
                <option>Intermédiaire</option>
                <option>Avancé</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Type d'élève: </label>
              <select
                name="studentType"
                value={formData.studentType || ""}
                onChange={handleChange}
                className="input-style"
              >
                <option value="regular">Régulier</option>
                <option value="occasional">Occasionnel</option>
                <option value="online-only">En ligne uniquement</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">Préférences de notification</h3>
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="notificationPreferences.email"
                  checked={formData.notificationPreferences?.email || false}
                  onChange={handleChange}
                />
                Email
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="notificationPreferences.sms"
                  checked={formData.notificationPreferences?.sms || false}
                  onChange={handleChange}
                />
                SMS
              </label>
              <label className="flex items-center gap-2">
                Rappel : 
                <input
                  type="number"
                  name="notificationPreferences.reminder"
                  value={formData.notificationPreferences?.reminder || 24}
                  onChange={handleChange}
                  className="w-16 ml-2 input-style"
                />
                h avant cours
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentProfileContent;
