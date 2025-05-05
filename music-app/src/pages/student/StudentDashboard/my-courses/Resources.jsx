import { useEffect, useState } from "react";
import { Download, FileAudio, FileText, FileVideo, LinkIcon } from "lucide-react";
import { useSchedule } from "../../../../utils/hooks";

const iconByType = {
  pdf: <FileText className="w-5 h-5 text-red-500" />,
  audio: <FileAudio className="w-5 h-5 text-indigo-500" />,
  video: <FileVideo className="w-5 h-5 text-blue-500" />,
  link: <LinkIcon className="w-5 h-5 text-green-500" />,
};

const MyResources = () => {
  const { fetchStudentSchedules } = useSchedule();
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const load = async () => {
      const schedules = await fetchStudentSchedules();
      const files = schedules
        .flatMap(s => (s.resources || []).map(r => ({
          ...r,
          courseTitle: s.course?.title || "Cours inconnu",
          scheduleDate: s.date,
          id: `${s._id}-${r.url}`,
        })));
      setResources(files);
    };
    load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">📂 Mes ressources de cours</h2>

      {resources.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucun document n’est encore disponible.</p>
      ) : (
        <div className="space-y-4">
          {resources.map((file) => (
            <div key={file.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center justify-between">
              <div className="flex items-center gap-3">
                {iconByType[file.type] || <FileText className="w-5 h-5" />}
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{file.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {file.courseTitle} — {new Date(file.scheduleDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
              >
                Télécharger <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResources;
