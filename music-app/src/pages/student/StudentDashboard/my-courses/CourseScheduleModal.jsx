import { Dialog } from "../../../../components/ui";
import { getThemeClass } from "../../../../utils/functions";

const CourseScheduleModal = ({ open, onClose, schedules, theme }) => {
  return (
    <Dialog onOpen={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className={`max-w-2xl w-full rounded-lg shadow-lg p-6 ${getThemeClass("bg-white", "bg-gray-800 text-white", theme)}`}>
          <Dialog.Title className="text-2xl font-bold mb-4">
            📅 Planning du cours
          </Dialog.Title>

          {schedules?.length === 0 || schedules === undefined ? (
            <p className="text-gray-500 dark:text-gray-400">Aucun créneau disponible pour ce cours.</p>
          ) : (
            <ul className="space-y-4">
              {schedules.map((s) => (
                <li key={s._id} className="border-b pb-2">
                  <p><strong>Date :</strong> {new Date(s.date).toLocaleDateString()}</p>
                  <p><strong>Heure :</strong> {s.startTime} - {s.endTime}</p>
                  {s.roomNumber && <p><strong>Salle :</strong> {s.roomNumber}</p>}
                  {s.professor && <p><strong>Professeur :</strong> {s.professor.firstname} {s.professor.lastname}</p>}
                  {s.videoLink && <p><strong>Lien vidéo :</strong> <a href={s.videoLink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Accéder</a></p>}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 text-right">
            <button onClick={onClose} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Fermer
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CourseScheduleModal;
