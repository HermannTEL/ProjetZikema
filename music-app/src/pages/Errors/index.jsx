import React, { Component, useState } from 'react';
import { useError } from '../../utils/hooks';

// Composant HOC pour connecter ErrorBoundary au contexte
const withErrorContext = (WrappedComponent) => {
  return (props) => {
    const errorContext = useError();
    
    return <WrappedComponent {...props} errorContext={errorContext} />;
  };
};

// Composant ErrorBoundary
class ErrorBoundaryBase extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  componentDidMount() {
    window.addEventListener('error', this.handleWindowError);
    window.addEventListener('unhandledrejection', this.handleWindowUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleWindowError);
    window.removeEventListener('unhandledrejection', this.handleWindowUnhandledRejection);
  }

  handleWindowError = (event) => {
    console.error('Erreur globale détectée:', event.message, 'URL:', event.filename, 'Ligne:', event.lineno);
    
    const errorData = {
      type: 'window-error',
      message: event.message,
      stack: event.error?.stack,
      source: {
        filename: event.filename,
        line: event.lineno,
        column: event.colno
      },
      error: event.error
    };
    
    if (this.props.onError) {
      this.props.onError(errorData);
    }
    
    // Mise à jour du contexte d'erreur
    if (this.props.errorContext && this.props.syncWithErrorContext) {
      this.props.errorContext.setError(errorData);
    }
    
    if (this.props.captureGlobalErrors) {
      this.setState({ 
        hasError: true, 
        error: event.error || new Error(event.message),
        errorInfo: {
          componentStack: `at ${event.filename}:${event.lineno}:${event.colno}`
        }
      });
      event.preventDefault();
    }
  }

  handleWindowUnhandledRejection = (event) => {
    console.error('Promesse rejetée non gérée:', event.reason);
    
    const errorData = {
      type: 'unhandled-rejection',
      message: event.reason?.message || 'Promesse rejetée non gérée',
      stack: event.reason?.stack,
      reason: event.reason,
      error: event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    };
    
    if (this.props.onError) {
      this.props.onError(errorData);
    }
    
    // Mise à jour du contexte d'erreur
    if (this.props.errorContext && this.props.syncWithErrorContext) {
      this.props.errorContext.setError(errorData);
    }
    
    if (this.props.capturePromiseRejections) {
      this.setState({ 
        hasError: true,
        error: errorData.error,
        errorInfo: {
          componentStack: 'Promesse rejetée non gérée'
        }
      });
      event.preventDefault();
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ 
      hasError: true, 
      error, 
      errorInfo 
    });
    
    console.error('Erreur capturée par ErrorBoundary:', error);
    console.error('Informations sur le composant:', errorInfo);
    
    const errorData = {
      type: 'react-error',
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      error
    };
    
    if (this.props.onError) {
      this.props.onError(errorData);
    }
    
    // Mise à jour du contexte d'erreur
    if (this.props.errorContext && this.props.syncWithErrorContext) {
      this.props.errorContext.setError(errorData);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Réinitialiser aussi le contexte d'erreur
    if (this.props.errorContext && this.props.syncWithErrorContext) {
      this.props.errorContext.clearError();
    }
    
    if (this.props.onReset) {
      this.props.onReset();
    } else if (this.props.resetAction === 'reload') {
      window.location.reload();
    }
  }

  render() {
    const { 
      fallback, 
      fallbackRender, 
      resetButton = true, 
      resetButtonText = "Réessayer",
      children 
    } = this.props;
    
    if (this.state.hasError) {
      if (fallback) {
        return fallback;
      }
      
      if (fallbackRender) {
        return fallbackRender({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetErrorBoundary: this.handleReset
        });
      }
      
      return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md mt-10 border border-red-200">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
            {this.props.title || "Une erreur est survenue"}
          </h2>
          
          <p className="text-gray-600 text-center mb-4">
            {this.props.message || "Nous sommes désolés pour ce problème. Veuillez réessayer."}
          </p>
          
          {this.state.error && this.props.showErrorDetails && (
            <div className="bg-gray-50 p-4 rounded mb-4 overflow-auto max-h-40">
              <p className="text-sm font-mono text-red-700 mb-2">{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <p className="text-xs font-mono text-gray-600 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </p>
              )}
            </div>
          )}
          
          {resetButton && (
            <div className="flex justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
              >
                {resetButtonText}
              </button>
            </div>
          )}
        </div>
      );
    }

    return children;
  }
}

// Composant HOC pour connecter ErrorBoundary au contexte
export const ErrorBoundaryWithContext = withErrorContext(ErrorBoundaryBase);

// Composant wrapper pour utiliser ErrorBoundary avec hooks
const ErrorBoundaryHooks = (props) => {
  const [key, setKey] = useState(0);
  
  const handleReset = () => {
    setKey(prevKey => prevKey + 1);
    if (props.onReset) {
      props.onReset();
    }
  };
  
  return (
    <ErrorBoundaryWithContext
      {...props}
      key={key}
      onReset={handleReset}
      syncWithErrorContext={props.syncWithErrorContext !== false}
    />
  );
};

export { ErrorBoundaryBase };
export default ErrorBoundaryHooks;