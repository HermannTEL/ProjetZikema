import { useEffect, useState } from "react";
import { FileText, Music, Video, Link2, Upload, Trash2 } from "lucide-react";

const mockResources = [
  { id: 1, title: "Plan de cours", type: "pdf", url: "/doc1.pdf" },
  { id: 2, title: "Exercice audio 1", type: "audio", url: "/track.mp3" },
  { id: 3, title: "Tutoriel vidéo", type: "video", url: "/video.mp4" },
  { id: 4, title: "Lien Google Drive", type: "link", url: "https://drive.google.com/" }
];

const MyDocuments = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ title: "", type: "pdf", url: "" });

  useEffect(() => {
    // TODO: fetch depuis backend
    setResources(mockResources);
  }, []);

  const handleUpload = (e) => {
    e.preventDefault();
    const newRes = { id: Date.now(), ...form };
    setResources((prev) => [...prev, newRes]);
    setForm({ title: "", type: "pdf", url: "" });
  };

  const handleDelete = (id) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="text-red-500" />;
      case "audio":
        return <Music className="text-green-500" />;
      case "video":
        return <Video className="text-blue-500" />;
      case "link":
        return <Link2 className="text-yellow-500" />;
      default:
        return <FileText />;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">📁 Mes documents</h2>

      <form onSubmit={handleUpload} className="space-y-4 bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-style"
            required
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="input-style"
          >
            <option value="pdf">PDF</option>
            <option value="audio">Audio</option>
            <option value="video">Vidéo</option>
            <option value="link">Lien</option>
          </select>
          <input
            type="url"
            placeholder="URL ou lien"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="input-style"
            required
          />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Upload className="w-4 h-4" /> Ajouter
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {getIcon(res.type)}
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {res.title}
              </a>
            </div>
            <button onClick={() => handleDelete(res.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDocuments;
