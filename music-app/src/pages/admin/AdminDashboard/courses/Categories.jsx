import { useState } from "react";
import { BadgePlus, Trash2, Pencil } from "lucide-react";
import { useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const CourseCategories = () => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([
    { id: 1, name: "Piano", description: "Cours de piano tous niveaux" },
    { id: 2, name: "Guitare", description: "Classique, acoustique et électrique" },
    { id: 3, name: "Chant", description: "Technique vocale, interprétation, respiration" },
  ]);
  const [newCat, setNewCat] = useState({ name: "", description: "" });

  const handleAdd = () => {
    const newId = Date.now();
    if (!newCat.name) return;
    setCategories([...categories, { ...newCat, id: newId }]);
    setNewCat({ name: "", description: "" });
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
        🏷️ Catégories de cours
      </h2>

      {/* Ajout */}
      <div className={getThemeClass("bg-white p-4 rounded-xl shadow space-y-2", "bg-gray-800 p-4 rounded-xl shadow space-y-2", theme)}>
        <h4 className={getThemeClass("font-semibold text-lg text-gray-700", "font-semibold text-lg text-gray-200", theme) + " flex items-center gap-2"}>
          <BadgePlus className="w-5 h-5 text-indigo-600" />
          Nouvelle catégorie
        </h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nom"
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            className={getThemeClass("input-style w-full", "input-style w-full bg-gray-800 text-white border-gray-600", theme)}
          />
          <input
            type="text"
            placeholder="Description"
            value={newCat.description}
            onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
            className={getThemeClass("input-style w-full", "input-style w-full bg-gray-800 text-white border-gray-600", theme)}
          />
          <button className="btn-primary" onClick={handleAdd}>
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className={getThemeClass("bg-white p-4 rounded-xl shadow", "bg-gray-900 p-4 rounded-xl shadow", theme)}>
        <h4 className={getThemeClass("font-semibold text-lg text-gray-700 mb-2", "font-semibold text-lg text-gray-200 mb-2", theme)}>
          Liste actuelle
        </h4>
        <ul className={getThemeClass("divide-y divide-gray-200", "divide-y divide-gray-700", theme)}>
          {categories.map((cat) => (
            <li key={cat.id} className="py-3 flex justify-between items-center">
              <div>
                <p className={getThemeClass("font-semibold text-gray-800", "font-semibold text-white", theme)}>{cat.name}</p>
                <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>{cat.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-sm btn-outline text-yellow-600">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  className="btn-sm btn-danger"
                  onClick={() => handleDelete(cat.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseCategories;
