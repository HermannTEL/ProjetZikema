import { useEffect, useState } from "react";
import { CalendarIcon, GraduationCap, UserRound } from "lucide-react";
import { useProgress } from "../../../../utils/hooks";
import { ProgressCircle } from "../../../../components/ui";

const ProgressEvaluations = () => {
  const { fetchStudentProgress } = useProgress();
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchStudentProgress();
      setEvaluations(data || []);
    };
    load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">📈 Mes évaluations</h2>

      {evaluations.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucune évaluation n&apos;a encore été enregistrée.</p>
      ) : (
        <div className="space-y-6">
          {evaluations.map((evalItem) => (
            <div key={evalItem._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
              <div className="flex justify-between flex-wrap">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{evalItem.course?.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <GraduationCap className="w-4 h-4" /> {evalItem.course?.instrument} — {evalItem.course?.level}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <UserRound className="w-4 h-4" /> {evalItem.professor?.firstname} {evalItem.professor?.lastname}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <CalendarIcon className="w-4 h-4" /> {new Date(evalItem.evaluationDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-4 mt-4 sm:mt-0">
                  <ProgressCircle completed={(evalItem.evaluation?.overall || 0) * 10} // Convertir la note sur 10 en pourcentage
                    size={64} 
                    label={true}  />
                  <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                    <p>Technique: {evalItem.evaluation?.technique}/10</p>
                    <p>Théorie: {evalItem.evaluation?.theory}/10</p>
                    <p>Musicalité: {evalItem.evaluation?.musicality}/10</p>
                    <p>Engagement: {evalItem.evaluation?.engagement}/10</p>
                  </div>
                </div>
              </div>

              {evalItem.feedback && (
                <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                  <h4 className="font-semibold mb-1">🗒️ Commentaire du professeur</h4>
                  <p className="italic">{evalItem.feedback}</p>
                </div>
              )}

              {(evalItem.strengths?.length || evalItem.areasToImprove?.length || evalItem.recommendedExercises?.length) > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm text-gray-700 dark:text-gray-300">
                  {evalItem.strengths?.length > 0 && (
                    <div>
                      <h4 className="font-semibold">✅ Points forts</h4>
                      <ul className="list-disc ml-4">
                        {evalItem.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {evalItem.areasToImprove?.length > 0 && (
                    <div>
                      <h4 className="font-semibold">📌 À améliorer</h4>
                      <ul className="list-disc ml-4">
                        {evalItem.areasToImprove.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                  )}
                  {evalItem.recommendedExercises?.length > 0 && (
                    <div>
                      <h4 className="font-semibold">🎯 Exercices suggérés</h4>
                      <ul className="list-disc ml-4">
                        {evalItem.recommendedExercises.map((ex, i) => <li key={i}>{ex}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressEvaluations;
