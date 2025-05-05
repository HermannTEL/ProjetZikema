import { useEffect, useRef, useState } from "react";
import { Save, Upload, Pencil } from "lucide-react";
import { useUser } from "../../../../utils/hooks";

const ProfessorProfileContent = ({ setPath }) => {
  const { updateProfile } = useUser();
  const [profile, setProfile] = useState({});
  const [message, setMessage] = useState("");
  const storedUser  = JSON.parse(localStorage.getItem('user'));

  const professor = useRef();

  useEffect(() => {
      if (storedUser ) {
          professor.current = storedUser ;
      }
  }, [storedUser ]);

  useEffect(() => {
    const fetchProfile = async () => {
      const me = professor.current;
      setProfile(me);
    };
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value.split(',').map((v) => v.trim()) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profile);
    setMessage("✅ Profil mis à jour !");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAvailability = (path) => {
    setPath(path)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">👤 Mon profil professionnel</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="flex items-center gap-4">
          <img
            src={profile.profileImage || "/default-avatar.png"}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <button type="button" className="btn-secondary inline-flex gap-2">
            <Upload className="w-4 h-4" /> Modifier photo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={profile.firstname || ""}
            onChange={(e) => handleChange("firstname", e.target.value)}
            className="input-style"
            placeholder="Prénom"
          />
          <input
            type="text"
            value={profile.lastname || ""}
            onChange={(e) => handleChange("lastname", e.target.value)}
            className="input-style"
            placeholder="Nom"
          />
          <input
            type="email"
            value={profile.email || ""}
            className="input-style"
            readOnly
          />
          <input
            type="tel"
            value={profile.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="input-style"
            placeholder="Téléphone"
          />
        </div>

        <textarea
          rows="4"
          className="input-style"
          placeholder="Biographie"
          value={profile.bio || ""}
          onChange={(e) => handleChange("bio", e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            className="input-style"
            placeholder="Instruments (ex: piano, guitare)"
            value={profile.instruments?.join(", ") || ""}
            onChange={(e) => handleArrayChange("instruments", e.target.value)}
          />
          <input
            type="text"
            className="input-style"
            placeholder="Expertise (ex: jazz, classique)"
            value={profile.expertise?.join(", ") || ""}
            onChange={(e) => handleArrayChange("expertise", e.target.value)}
          />
        </div>

        <input
          type="number"
          min={0}
          step={5}
          value={profile.hourlyRate || ""}
          onChange={(e) => handleChange("hourlyRate", parseInt(e.target.value))}
          className="input-style"
          placeholder="Tarif horaire (€)"
        />

        <div className="text-sm text-right">
          <a onClick={()=>handleAvailability("/prof/schedule/availability")} className="text-blue-600 dark:text-blue-400 hover:underline">
            🕒 Gérer mes disponibilités
          </a>
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> Enregistrer
        </button>

        {message && <p className="text-green-600 dark:text-green-400">{message}</p>}
      </form>
    </div>
  );
};

export default ProfessorProfileContent;
