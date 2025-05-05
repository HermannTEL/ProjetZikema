import { useEffect, useState } from "react";
import { Trash2, Save, Plus } from "lucide-react";
import { useCenter, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const CenterEquipmentManager = () => {
  const { fetchAllCenters, updateCenter } = useCenter();
  const { theme } = useTheme();
  const [center, setCenter] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [newEquip, setNewEquip] = useState({ name: "", type: "", room: "" });

  useEffect(() => {
    const fetchData = async () => {
      const centers = await fetchAllCenters();
      const selected = centers.centers?.[0];
      setCenter(selected);
      if (selected?.rooms?.length > 0) {
        const equipArray = selected.rooms.flatMap((room) =>
          room.equipment?.map((item) => ({ name: item, room: room.name, roomId: room._id })) || []
        );
        setEquipmentList(equipArray);
      }
    };
    fetchData();
  }, []);

  const handleAddEquipment = () => {
    if (!newEquip.name || !newEquip.room) return;

    const updatedRooms = center.rooms.map((room) => {
      if (room.name === newEquip.room || room._id === newEquip.room) {
        return {
          ...room,
          equipment: [...(room.equipment || []), newEquip.name]
        };
      }
      return room;
    });

    updateCenter(center._id, { ...center, rooms: updatedRooms });
    setEquipmentList((prev) => [...prev, { name: newEquip.name, room: newEquip.room }]);
    setNewEquip({ name: "", type: "", room: "" });
  };

  const handleDelete = (equipName, roomName) => {
    const updatedRooms = center.rooms.map((room) => {
      if (room.name === roomName) {
        return {
          ...room,
          equipment: room.equipment?.filter((eq) => eq !== equipName)
        };
      }
      return room;
    });
    updateCenter(center._id, { ...center, rooms: updatedRooms });
    setEquipmentList((prev) => prev.filter((eq) => !(eq.name === equipName && eq.room === roomName)));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>🎛️ Équipements du centre</h2>

      <div className={getThemeClass("bg-white p-5 rounded-xl shadow space-y-4", "bg-gray-800 p-5 rounded-xl shadow space-y-4", theme)}>
        <h3 className={getThemeClass("text-xl font-semibold text-gray-800", "text-xl font-semibold text-white", theme)}>Ajouter un équipement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="input-style" placeholder="Nom de l’équipement" value={newEquip.name} onChange={(e) => setNewEquip({ ...newEquip, name: e.target.value })} />
          <input className="input-style" placeholder="Type (instrument, accessoire...)" value={newEquip.type} onChange={(e) => setNewEquip({ ...newEquip, type: e.target.value })} />
          <select className="input-style" value={newEquip.room} onChange={(e) => setNewEquip({ ...newEquip, room: e.target.value })}>
            <option value="">Salle</option>
            {center?.rooms?.map((r) => (
              <option key={r._id} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleAddEquipment} className="btn-primary flex items-center gap-2 mt-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className={getThemeClass("bg-white p-5 rounded-xl shadow space-y-2", "bg-gray-800 p-5 rounded-xl shadow space-y-2", theme)}>
        <h3 className={getThemeClass("text-xl font-semibold text-gray-800", "text-xl font-semibold text-white", theme)}>📦 Liste des équipements</h3>
        {equipmentList.length === 0 ? (
          <p className={getThemeClass("text-gray-500", "text-gray-400", theme)}>Aucun équipement pour le moment.</p>
        ) : (
          <ul className={getThemeClass("divide-y divide-gray-200", "divide-y divide-gray-700", theme)}>
            {equipmentList.map((e, i) => (
              <li key={i} className="flex justify-between py-2 items-center text-sm">
                <div>
                  <strong className={getThemeClass("text-gray-800", "text-white", theme)}>{e.name}</strong>
                  <span className={getThemeClass("text-gray-500 ml-2", "text-gray-300 ml-2", theme)}>({e.room})</span>
                </div>
                <button onClick={() => handleDelete(e.name, e.room)} className="btn-danger text-xs">
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CenterEquipmentManager;