import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useVideoCourseActions from "../../../../utils/hooks/useVideoCourseActions";

const CreateCourse = () => {
  const { createCourse } = useVideoCourseActions();
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    instrument: "",
    level: "Débutant",
    duration: 60,
    type: "individual",
    capacity: { min: 1, max: 1 },
    price: 20,
    location: { type: "online", address: "" },
    imageUrl: "",
    tags: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("capacity.")) {
      setData({
        ...data,
        capacity: { ...data.capacity, [name.split(".")[1]]: parseInt(value) },
      });
    } else if (name.startsWith("location.")) {
      setData({
        ...data,
        location: { ...data.location, [name.split(".")[1]]: value },
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const profId = localStorage.getItem("userId");
    const courseData = { ...data, professor: profId };
    await createCourse(courseData);
    setMessage("✅ Cours créé avec succès !");
    setTimeout(() => navigate("/prof/my-courses/active"), 2000);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">➕ Créer un cours</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Titre</label>
            <input name="title" value={data.title} onChange={handleChange} className="input-style" required />
          </div>
          <div>
            <label className="label">Instrument</label>
            <input name="instrument" value={data.instrument} onChange={handleChange} className="input-style" required />
          </div>
          <div>
            <label className="label">Niveau</label>
            <select name="level" value={data.level} onChange={handleChange} className="input-style">
              <option>Débutant</option>
              <option>Intermédiaire</option>
              <option>Avancé</option>
            </select>
          </div>
          <div>
            <label className="label">Durée (min)</label>
            <input type="number" name="duration" value={data.duration} onChange={handleChange} className="input-style" />
          </div>
          <div>
            <label className="label">Type</label>
            <select name="type" value={data.type} onChange={handleChange} className="input-style">
              <option value="individual">Individuel</option>
              <option value="group">Groupe</option>
              <option value="workshop">Atelier</option>
              <option value="masterclass">Masterclass</option>
            </select>
          </div>
          <div>
            <label className="label">Prix (€)</label>
            <input type="number" name="price" value={data.price} onChange={handleChange} className="input-style" />
          </div>
        </div>

        {data.type === "group" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Capacité min</label>
              <input
                type="number"
                name="capacity.min"
                value={data.capacity.min}
                onChange={handleChange}
                className="input-style"
              />
            </div>
            <div>
              <label className="label">Capacité max</label>
              <input
                type="number"
                name="capacity.max"
                value={data.capacity.max}
                onChange={handleChange}
                className="input-style"
              />
            </div>
          </div>
        )}

        <div>
          <label className="label">Type de lieu</label>
          <select
            name="location.type"
            value={data.location.type}
            onChange={handleChange}
            className="input-style"
          >
            <option value="online">En ligne</option>
            <option value="home">Domicile</option>
            <option value="center">Centre</option>
          </select>
        </div>

        {data.location.type !== "center" && (
          <div>
            <label className="label">Adresse</label>
            <input
              name="location.address"
              value={data.location.address}
              onChange={handleChange}
              className="input-style"
            />
          </div>
        )}

        <div>
          <label className="label">Image (URL)</label>
          <input name="imageUrl" value={data.imageUrl} onChange={handleChange} className="input-style" />
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
          Créer le cours
        </button>

        {message && <p className="text-green-600 font-semibold mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default CreateCourse;
