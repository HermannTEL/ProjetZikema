import React, { createContext, useReducer, useCallback } from 'react';

// Création du contexte
const ErrorContext = createContext();

// Actions
const ERROR_ACTIONS = {
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_ERROR_LOG: 'ADD_ERROR_LOG'
};

// État initial
const initialState = {
  error: null,
  hasError: false,
  errorLogs: []
};

// Reducer
function errorReducer(state, action) {
  switch (action.type) {
    case ERROR_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        hasError: true
      };
    case ERROR_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        hasError: false
      };
    case ERROR_ACTIONS.ADD_ERROR_LOG:
      // Garder un historique des erreurs (limité à 50 par exemple)
      return {
        ...state,
        errorLogs: [action.payload, ...state.errorLogs].slice(0, 50)
      };
    default:
      return state;
  }
}

// Provider
const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  const setError = useCallback((error) => {
    // Ajouter un horodatage à l'erreur
    const errorWithTimestamp = {
      ...error,
      timestamp: new Date().toISOString()
    };
    
    // Enregistrer l'erreur dans les logs
    dispatch({ 
      type: ERROR_ACTIONS.ADD_ERROR_LOG, 
      payload: errorWithTimestamp 
    });
    
    // Mettre à jour l'état d'erreur actuel
    dispatch({ 
      type: ERROR_ACTIONS.SET_ERROR, 
      payload: errorWithTimestamp 
    });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ERROR_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    error: state.error,
    hasError: state.hasError,
    errorLogs: state.errorLogs,
    setError,
    clearError
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export { ErrorContext, ErrorProvider };
