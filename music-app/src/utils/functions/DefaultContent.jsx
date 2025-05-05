const DefaultContent = ({ path }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Contenu</h2>
      <p className="text-gray-600 dark:text-gray-300">Contenu pour: {path}</p>
    </div>
);

export { DefaultContent }

