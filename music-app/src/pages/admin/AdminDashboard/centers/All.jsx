import { useEffect, useState } from "react";
import { MapPin, Building2, Phone, Trash2, Eye } from "lucide-react";
import { useCenter, useTheme, useToast } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";
import CenterProfileEditor from "../../../Profile/CenterProfileEditor";
import { Button } from "../../../../components/ui";

const AllCenters = () => {
  const { theme } = useTheme();
  const { fetchAllCenters, deleteCenter } = useCenter();
  const { toast } = useToast();

  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState();
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchAllCenters();
      setCenters(res?.centers || []);
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    const res = await deleteCenter(id);
    console.log(res);
    if (!res.success) {
      console.error("Error deleting center.");
      return;
    }
    setCenters((prev) => prev.filter((c) => c._id !== id));
    toast({
      title: "Centre supprimé",
      description: res.message,
      status: "success",
    });
  };

  const handleDisplay = (center) => {
    setSelectedCenter(center);
    setDisplay("edit");
  };

  const filtered = centers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
            🏢 Tous les centres
          </h2>
          <Button
            className="btn-primary"
            onClick={() => {
              setSelectedCenter(null);
              setDisplay("create");
            }}
          >
            ➕ Ajouter un centre
          </Button>

          <input
            className={getThemeClass("input-style max-w-lg", "input-style max-w-lg bg-gray-800 text-white border-gray-600", theme)}
            placeholder="Rechercher un centre par nom ou ville"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((center) => (
              <div
                key={center._id}
                className={getThemeClass("bg-white p-4 rounded-xl shadow space-y-2", "bg-gray-800 p-4 rounded-xl shadow space-y-2", theme)}
              >
                <h3 className={getThemeClass("text-xl font-bold text-gray-800", "text-xl font-bold text-white", theme) + " flex items-center gap-2"}>
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  {center.name}
                </h3>
                <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                  <MapPin className="inline w-4 h-4" /> {center.address.city}, {center.address.country}
                </p>
                <p className={getThemeClass("text-sm text-gray-500", "text-sm text-gray-300", theme)}>
                  <Phone className="inline w-4 h-4" /> {center.contact?.phone || "Aucun numéro"}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    center.status === "active"
                      ? getThemeClass("bg-green-100 text-green-700", "bg-green-900 text-green-100", theme)
                      : getThemeClass("bg-gray-200 text-gray-600", "bg-gray-700 text-gray-300", theme)
                  }`}>
                    {center.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="btn-sm btn-outline text-blue-600" onClick={() => handleDisplay(center)}>
                      <Eye className="w-4 h-4" />
                    </button>
                    {/* <button
                      className={`btn-sm ${center.status === "active"
                        ? `rounded-full p-0.5 ${getThemeClass("bg-red-300 text-red-900", "bg-red-900 text-red-200", theme)}`
                        : `${getThemeClass("text-green-700", "text-green-300", theme)}`
                      }`}
                      onClick={() => updateCenterStatus(center._id, { status: center.status === "active" ? "inactive" ?"active" : "under maintenance" })}
                    >
                      {center.status === "active" ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button> */}
                    <button
                      className="btn-sm btn-danger"
                      onClick={() => handleDelete(center._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AllCenters;
