import { useEffect, useRef, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { useUser } from "../../../../utils/hooks";

const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const AvailabilityManagement = () => {
  const { updateAvailability } = useUser();
  const [availability, setAvailability] = useState([]);
  const [message, setMessage] = useState("");
  const storedUser  = JSON.parse(localStorage.getItem('user'));

  const professor = useRef();

  useEffect(() => {
      if (storedUser ) {
          professor.current = storedUser ;
      }
  }, [storedUser ]);

  useEffect(() => {
    const fetch = async () => {
      const me = professor.current;
      console.log(me);
      setAvailability(me.availability || []);
    };
    fetch();
  }, []);

  const handleAdd = () => {
    setAvailability([...availability, { day: "lundi", startTime: "09:00", endTime: "17:00" }]);
  };

  const handleChange = (index, key, value) => {
    const updated = [...availability];
    updated[index][key] = value;
    setAvailability(updated);
  };

  const handleRemove = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    await updateAvailability(availability);
    setMessage("✅ Disponibilités mises à jour");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">🕒 Mes disponibilités</h2>

      <div className="space-y-4">
        {availability.map((slot, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-2 items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <select
              value={slot.day}
              onChange={(e) => handleChange(index, "day", e.target.value)}
              className="input-style w-full md:w-1/3"
            >
              {jours.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => handleChange(index, "startTime", e.target.value)}
              className="input-style"
            />
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => handleChange(index, "endTime", e.target.value)}
              className="input-style"
            />
            <button onClick={() => handleRemove(index)} className="btn-danger">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={handleAdd} className="btn-secondary">➕ Ajouter</button>
        <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2">
          <Save className="w-4 h-4" /> Sauvegarder
        </button>
      </div>

      {message && <p className="text-green-600 dark:text-green-400">{message}</p>}
    </div>
  );
};

export default AvailabilityManagement;
