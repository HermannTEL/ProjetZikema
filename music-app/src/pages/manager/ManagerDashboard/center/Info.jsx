import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";
import { useCenter, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const CenterInfo = () => {
  const { fetchAllCenters, updateCenter } = useCenter();
  const { theme } = useTheme();
  const [center, setCenter] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const centers = await fetchAllCenters();
      setCenter(centers.centers?.[0] || {});
    };
    fetch();
  }, []);

  const handleChange = (field, value) => {
    setCenter((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setCenter((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const handleContactChange = (field, value) => {
    setCenter((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCenter(center._id, center);
    setMessage("✅ Informations mises à jour !");
    setTimeout(() => setMessage(""), 3000);
  };

  if (!center) return <p className="text-center text-gray-500">Chargement...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>🏫 Informations du centre</h2>

      <form onSubmit={handleSubmit} className={getThemeClass("space-y-6 bg-white p-6 rounded-xl shadow", "space-y-6 bg-gray-800 p-6 rounded-xl shadow", theme)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input-style" value={center.name || ""} onChange={(e) => handleChange("name", e.target.value)} placeholder="Nom du centre" />
          <input className="input-style" value={center.address?.street || ""} onChange={(e) => handleAddressChange("street", e.target.value)} placeholder="Rue" />
          <input className="input-style" value={center.address?.city || ""} onChange={(e) => handleAddressChange("city", e.target.value)} placeholder="Ville" />
          <input className="input-style" value={center.address?.postalCode || ""} onChange={(e) => handleAddressChange("postalCode", e.target.value)} placeholder="Code postal" />
          <input className="input-style" value={center.address?.country || ""} onChange={(e) => handleAddressChange("country", e.target.value)} placeholder="Pays" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="input-style" value={center.contact?.phone || ""} onChange={(e) => handleContactChange("phone", e.target.value)} placeholder="Téléphone" />
          <input className="input-style" value={center.contact?.email || ""} onChange={(e) => handleContactChange("email", e.target.value)} placeholder="Email" />
          <input className="input-style" value={center.contact?.website || ""} onChange={(e) => handleContactChange("website", e.target.value)} placeholder="Site web" />
        </div>

        <textarea rows={4} className="input-style" value={center.description || ""} onChange={(e) => handleChange("description", e.target.value)} placeholder="Description du centre" />

        <input type="url" className="input-style" value={center.mainImage || ""} onChange={(e) => handleChange("mainImage", e.target.value)} placeholder="Lien de l’image principale" />

        <button type="submit" className="btn-primary flex gap-2 items-center">
          <Save className="w-4 h-4" /> Enregistrer
        </button>

        {message && <p className={getThemeClass("text-green-600", "text-green-400", theme)}>{message}</p>}
      </form>
    </div>
  );
};

export default CenterInfo;
