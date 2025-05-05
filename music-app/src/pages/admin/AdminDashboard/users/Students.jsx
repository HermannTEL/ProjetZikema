import { useEffect, useState } from "react";
import { BadgeCheck, Ban, Eye } from "lucide-react";
import { useUser, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";
import UserProfileEditor from "../../../Profile";

const Students = () => {
  const { fetchAllUsers, toggleUserStatus } = useUser();
  const { theme } = useTheme();

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayProfile, setDisplayProfile] = useState(false);

  const fetchData = async () => {
    const users = await fetchAllUsers();
    const filtered = users?.filter((u) => u.role === "student");
    setStudents(filtered || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (id) => {
    await toggleUserStatus(id);
    fetchData();
  };

  const displayUserProfile = (id) => {
    // console.log("Display profile for student with ID:", id);
    setSelectedStudentId(id);
    setDisplayProfile(true);
  }

  return (
    <>
      {displayProfile ? (
        <UserProfileEditor
          userId={selectedStudentId}
          onClose={() => setDisplayProfile(false)}
        />
      ) : (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <h2 className={getThemeClass("text-3xl font-bold text-gray-800", "text-3xl font-bold text-white", theme)}>
            Étudiants inscrits
          </h2>

          {loading ? (
            <p className={getThemeClass("text-gray-500", "text-gray-300", theme)}>
              Chargement des étudiants...
            </p>
          ) : (
            <div className={getThemeClass("overflow-x-auto bg-white shadow rounded-xl", "overflow-x-auto bg-gray-900 shadow rounded-xl", theme)}>
              <table className="w-full text-sm text-left">
                <thead className={getThemeClass("text-xs text-gray-600 border-b", "text-xs text-gray-400 border-b border-gray-700", theme)}>
                  <tr>
                    <th className="p-3">Nom</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Niveau</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className={getThemeClass("border-b border-blue-100 text-slate-900", "border-b border-gray-800 text-blue-50", theme)}>
                      <td className="p-3">{student.firstname} {student.lastname}</td>
                      <td className="p-3">{student.email}</td>
                      <td className="p-3 capitalize">{student.studentType || '—'}</td>
                      <td className="p-3">{student.level || '—'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          student.isActive
                            ? getThemeClass("bg-green-100 text-green-700", "bg-green-900 text-green-100", theme)
                            : getThemeClass("bg-red-100 text-red-700", "bg-red-900 text-red-100", theme)
                        }`}>
                          {student.isActive ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => displayUserProfile(student._id)}
                          className={`btn-sm btn-outline ${getThemeClass("text-blue-700", "text-blue-300", theme)}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggle(student._id)}
                          className={`btn-sm ${student.isActive ? `${getThemeClass("text-red-700", "text-red-300", theme)}` : `${getThemeClass("text-green-700", "text-green-300", theme)}`}`}
                        >
                          {student.isActive ? <Ban className="w-4 h-4" /> : <BadgeCheck className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Students;
