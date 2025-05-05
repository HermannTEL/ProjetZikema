import { useError } from "../utils/hooks";

const ErrorLogsViewer = () => {
    const { errorLogs } = useError();
  
    return (
      <div className="mt-4">
        <h2 className="font-semibold text-lg mb-2">Historique des erreurs</h2>
        <ul className="space-y-1 text-sm">
          {errorLogs.map((log, index) => (
            <li key={index} className="border p-2 rounded bg-red-50 text-red-700">
              [{new Date(log.timestamp).toLocaleString()}] {log.message}
            </li>
          ))}
        </ul>
      </div>
    );
};

export default ErrorLogsViewer;