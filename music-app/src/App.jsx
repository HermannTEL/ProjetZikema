import './App.css';
import GlobalProvider from './utils/contexts/GlobalProvider';
import AppRouter from './routes/AppRouter';
import { captureException } from '@sentry/react';
import { useError } from './utils/hooks';
import { ErrorBoundaryWithContext } from './pages/Errors';

// Composant pour afficher un toast d'erreur
const ErrorToast = ({ error, onClose }) => {
  if (!error) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 shadow-md rounded-md max-w-md z-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">Erreur</h3>
          <div className="mt-1 text-sm">
            {error.message || "Une erreur est survenue"}
          </div>
          <div className="mt-2">
            <button
              onClick={onClose}
              className="text-xs text-red-700 hover:text-red-600 underline"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper pour l'application
const AppWithErrorHandling = () => {
  const { error, clearError } = useError();
  
  // Fonction pour gérer les erreurs globales
  const handleGlobalError = (errorData) => {
    console.error('Erreur globale:', errorData);
    
    // Envoyer à Sentry
    if (errorData.error) {
      captureException(errorData.error, {
        extra: {
          type: errorData.type,
          componentStack: errorData.componentStack || null
        },
        tags: {
          errorSource: 'app-global-error',
          errorType: errorData.type
        }
      });
    }
  };
  
  return (
    <>
      <ErrorToast error={error} onClose={clearError} />
      <GlobalProvider>
        <ErrorBoundaryWithContext
          title="Oops! Une erreur est survenue au niveau de l'application"
          message="Nous avons été notifiés du problème et travaillons à le résoudre"
          onError={handleGlobalError}
          showErrorDetails={process.env.NODE_ENV === 'development'}
          resetButtonText="Recharger l'application"
          resetAction="reload"
          syncWithErrorContext={true}
        >
          <AppRouter />
        </ErrorBoundaryWithContext>
      </GlobalProvider>
    </>
  );
};

function App() {
  return <AppWithErrorHandling />;
}

export default App;