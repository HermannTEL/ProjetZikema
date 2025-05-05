import { useEffect, useState } from "react";
import { Building, Plus, Trash2, Edit, Home, Settings } from "lucide-react";
import { useCenter, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";
import CenterProfileEditor from "../../../Profile/CenterProfileEditor";

const ManageRooms = () => {
  const { theme } = useTheme();
  const { fetchAllCenters, updateRoom, deleteRoom } = useCenter();
  const [centers, setCenters] = useState([]);
  const [display, setDisplay] = useState();
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchAllCenters();
      setCenters(res?.centers || []);
    };
    fetch();
  }, []);

  const handleRoomDelete = async (roomId) => {
    await deleteRoom(roomId);
    setCenters((prev) =>
      prev.map((center) =>
        center._id === selectedCenter._id
          ? {
              ...center,
              rooms: center.rooms.filter((room) => room._id !== roomId),
            }
          : center
      )
    );
  };

  const handleDisplay = (center) => {
    setSelectedCenter(center);
    setDisplay("edit");
  };

  const selectedRooms = selectedCenter?.rooms || [];

  return (
    <>
       {display ? (
          <CenterProfileEditor
            centerId={display === "edit" ? selectedCenter?._id : null}
            onClose={() => {
              setDisplay(false);
              setSelectedCenter(null);
              fetchAllCenters().then(res => setCenters(res?.centers || []));
            }}
            mode={selectedCenter ? "edit" : "create"}
          />
        ) : (
          <div className="p-6 max-w-6xl mx-auto space-y-6">
          <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
            🏫 Gestion des salles
          </h2>

          <select
            className={getThemeClass("input-style", "input-style bg-gray-800 text-white border-gray-600", theme)}
            onChange={(e) =>
              setSelectedCenter(
                centers.find((c) => c._id === e.target.value) || null
              )
            }
          >
            <option value="">Sélectionner un centre</option>
            {centers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.address.city})
              </option>
            ))}
          </select>

          {selectedCenter && (
            <div className={getThemeClass("bg-white", "bg-gray-900", theme) + " p-4 rounded-xl shadow space-y-4"}>
              <h3 className={getThemeClass("text-xl font-semibold text-gray-800", "text-xl font-semibold text-white", theme) + " flex items-center gap-2"}>
                <Home className="text-blue-500" /> Salles de {selectedCenter.name}
              </h3>

              {selectedRooms.length === 0 ? (
                <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>
                  Ce centre n'a pas encore de salle enregistrée.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedRooms.map((room) => (
                    <div
                      key={room._id}
                      className={getThemeClass("p-4 bg-gray-50", "p-4 bg-gray-800", theme) + " rounded-xl shadow-sm"}
                    >
                      <h4 className={getThemeClass("text-lg font-bold text-gray-800", "text-lg font-bold text-white", theme)}>
                        <Settings className="inline w-5 h-5 mr-1" />
                        {room.name}
                      </h4>
                      <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                        Type : {room.type} • Capacité : {room.capacity}
                      </p>
                      <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                        Équipements : {room.equipment.length > 0 ? room.equipment.join(", ") : "Aucun"}
                      </p>
                      <div className="flex justify-end gap-2 mt-2">
                        <button className="btn-sm btn-outline text-yellow-500"
                          onClick={() => {
                            // Handle edit room logic here
                            handleDisplay(selectedCenter);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRoomDelete(room._id)}
                          className="btn-sm btn-danger"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* <button className="btn-primary mt-4 inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Ajouter une salle
              </button> */}
            </div>
          )}
        </div>
        )}
    </>
  );
};

export default ManageRooms;
