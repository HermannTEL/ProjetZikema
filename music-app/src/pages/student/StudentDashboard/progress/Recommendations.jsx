import { useEffect, useState } from "react";
import { Target, CalendarIcon, UserRound, GraduationCap } from "lucide-react";
import { useProgress } from "../../../../utils/hooks";

const ProgressRecommendations = () => {
  const { fetchStudentProgress } = useProgress();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchStudentProgress();
      const withGoals = data?.filter(d => d.nextGoals?.length > 0) || [];
      setRecommendations(withGoals);
    };
    load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">🎯 Mes recommandations</h2>

      {recommendations.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucune recommandation n’a été enregistrée.</p>
      ) : (
        <div className="space-y-6">
          {recommendations.map((item) => (
            <div key={item._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
              <div className="flex justify-between flex-wrap items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{item.course?.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <GraduationCap className="w-4 h-4" /> {item.course?.instrument} — {item.course?.level}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <UserRound className="w-4 h-4" /> {item.professor?.firstname} {item.professor?.lastname}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <CalendarIcon className="w-4 h-4" /> {new Date(item.evaluationDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
                  <Target className="w-5 h-5 inline mr-1 text-blue-500" />
                  {item.nextGoals.length} recommandation{item.nextGoals.length > 1 ? "s" : ""}
                </div>
              </div>

              <ul className="list-disc mt-4 ml-6 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {item.nextGoals.map((goal, i) => (
                  <li key={i}>{goal}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressRecommendations;
