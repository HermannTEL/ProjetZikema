import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVideoCourse } from "../../../../../utils/hooks";

const CreateVideoCourse = () => {
  const { createVideoCourse } = useVideoCourse();
  const navigate = useNavigate();
  const professorId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    title: "",
    description: "",
    instrument: [],
    level: "Débutant",
    type: "recorded",
    format: "video",
    content: { videoUrl: "", duration: 0 },
    teacher: professorId,
    thumbnail: "",
    tags: [],
    categories: [],
    price: 0,
    isFree: false,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("content.")) {
      setForm({ ...form, content: { ...form.content, [name.split(".")[1]]: value } });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await createVideoCourse(form);
    setMsg("✅ Cours vidéo publié !");
    setTimeout(() => navigate("/prof/my-courses/video"), 2000);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">🎬 Publier un cours vidéo</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Titre</label>
            <input name="title" value={form.title} onChange={handleChange} className="input-style" required />
          </div>
          <div>
            <label className="label">Instrument(s)</label>
            <input name="instrument" value={form.instrument} onChange={handleChange} className="input-style" placeholder="ex: Piano,Guitare" />
          </div>
          <div>
            <label className="label">Niveau</label>
            <select name="level" value={form.level} onChange={handleChange} className="input-style">
              <option>Débutant</option>
              <option>Intermédiaire</option>
              <option>Avancé</option>
            </select>
          </div>
          <div>
            <label className="label">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-style">
              <option value="recorded">Pré-enregistré</option>
              <option value="live">En direct</option>
              <option value="webinar">Webinaire</option>
              <option value="masterclass">Masterclass</option>
            </select>
          </div>
          <div>
            <label className="label">Durée (min)</label>
            <input name="content.duration" value={form.content.duration} onChange={handleChange} className="input-style" />
          </div>
          <div>
            <label className="label">Lien vidéo</label>
            <input name="content.videoUrl" value={form.content.videoUrl} onChange={handleChange} className="input-style" />
          </div>
          <div>
            <label className="label">Thumbnail</label>
            <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="input-style" />
          </div>
          <div>
            <label className="label">Gratuit ?</label>{" "}
            <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} />
          </div>
        </div>

        {!form.isFree && (
          <div>
            <label className="label">Prix (€)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className="input-style" />
          </div>
        )}

        <div>
          <label className="label">Description</label>
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} className="input-style" />
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Publier
        </button>

        {msg && <p className="text-green-600 mt-2">{msg}</p>}
      </form>
    </div>
  );
};

export default CreateVideoCourse;
