import { useEffect, useState } from "react";
import { Trash2, PlusCircle, Save } from "lucide-react";
import { useCenter, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const roomTypes = ['studio', 'classroom', 'practice room', 'concert hall'];

const CenterRoomsManager = () => {
  const { fetchAllCenters, addRoom, updateRoom, deleteRoom } = useCenter();
  const { theme } = useTheme();
  const [center, setCenter] = useState(null);
  const [newRoom, setNewRoom] = useState({ name: "", capacity: 1, equipment: "", type: "studio" });
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const centers = await fetchAllCenters();
      setCenter(centers.centers?.[0] || null);
    };
    fetch();
  }, []);

  const handleAddRoom = async () => {
    const payload = { ...newRoom, equipment: newRoom.equipment.split(',').map(e => e.trim()) };
    const added = await addRoom({ ...payload, centerId: center._id });
    if (added) {
      setCenter((prev) => ({
        ...prev,
        rooms: [...prev.rooms, added]
      }));
      setNewRoom({ name: "", capacity: 1, equipment: "", type: "studio" });
    }
  };

  const handleUpdateRoom = async (id, updatedData) => {
    const payload = { ...updatedData, equipment: updatedData.equipment.split(',').map(e => e.trim()) };
    await updateRoom(id, payload);
    setEditMode(null);
  };

  const handleDeleteRoom = async (id) => {
    await deleteRoom(id);
    setCenter((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((r) => r._id !== id)
    }));
  };

  if (!center) return <p className="text-center text-gray-500">Chargement des salles...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>🏛️ Salles du centre</h2>

      <div className={getThemeClass("bg-white p-6 rounded-xl shadow space-y-4", "bg-gray-800 p-6 rounded-xl shadow space-y-4", theme)}>
        <h3 className={getThemeClass("text-xl font-semibold text-gray-700", "text-xl font-semibold text-white", theme)}>➕ Ajouter une salle</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="input-style" placeholder="Nom de la salle" value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} />
          <input type="number" min={1} className="input-style" placeholder="Capacité" value={newRoom.capacity} onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })} />
          <select className="input-style" value={newRoom.type} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}>
            {roomTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input className="input-style" placeholder="Équipements (séparés par des virgules)" value={newRoom.equipment} onChange={(e) => setNewRoom({ ...newRoom, equipment: e.target.value })} />
        </div>
        <button onClick={handleAddRoom} className="btn-primary mt-2">
          <PlusCircle className="inline w-4 h-4 mr-2" /> Ajouter
        </button>
      </div>

      <div className="space-y-4">
        {center.rooms?.length === 0 && (
          <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>Aucune salle enregistrée.</p>
        )}

        {center.rooms?.map((room) => (
          <div key={room._id} className={getThemeClass("bg-white p-5 rounded-xl shadow", "bg-gray-800 p-5 rounded-xl shadow", theme)}>
            {editMode === room._id ? (
              <EditRoomForm room={room} onSave={(data) => handleUpdateRoom(room._id, data)} onCancel={() => setEditMode(null)} theme={theme} />
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h4 className={getThemeClass("text-lg font-semibold text-gray-800", "text-lg font-semibold text-white", theme)}>{room.name}</h4>
                  <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                    Capacité : {room.capacity} | Type : {room.type} <br />
                    Équipements : {room.equipment?.join(", ")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditMode(room._id)} className="btn-secondary text-sm">Modifier</button>
                  <button onClick={() => handleDeleteRoom(room._id)} className="btn-danger text-sm">Supprimer</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EditRoomForm = ({ room, onSave, onCancel, theme }) => {
  const [editRoom, setEditRoom] = useState({
    name: room.name,
    capacity: room.capacity,
    type: room.type,
    equipment: room.equipment?.join(", ") || ""
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(editRoom); }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
        <input className="input-style" value={editRoom.name} onChange={(e) => setEditRoom({ ...editRoom, name: e.target.value })} />
        <input type="number" min={1} className="input-style" value={editRoom.capacity} onChange={(e) => setEditRoom({ ...editRoom, capacity: parseInt(e.target.value) })} />
        <select className="input-style" value={editRoom.type} onChange={(e) => setEditRoom({ ...editRoom, type: e.target.value })}>
          {roomTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input className="input-style" value={editRoom.equipment} onChange={(e) => setEditRoom({ ...editRoom, equipment: e.target.value })} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary"><Save className="inline w-4 h-4 mr-1" /> Sauvegarder</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
      </div>
    </form>
  );
};

export default CenterRoomsManager;
