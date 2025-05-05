import { createContext, useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastsRef = useRef([]);

  // Sync ref with state for cleanup
  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      toastsRef.current.forEach(toast => {
        if (toast.timeoutId) clearTimeout(toast.timeoutId);
      });
    };
  }, []);

  const toast = ({
    title,
    description = "",
    variant = "default",
    duration = 5000,
    position = "bottom-right",
    icon = true,
    dismissible = true
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Create timeoutId for this toast
    const timeoutId = setTimeout(() => {
      dismissToast(id);
    }, duration);

    const newToast = {
      id,
      title,
      description,
      variant,
      position,
      icon,
      dismissible,
      timeoutId
    };

    setToasts(prev => [...prev, newToast]);
    
    // Return the toast id for potential manual dismissal
    return id;
  };

  const dismissToast = (id) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (toast && toast.timeoutId) {
        clearTimeout(toast.timeoutId);
      }
      return prev.filter(t => t.id !== id);
    });
  };

  const getToastIcon = (variant) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
      case "destructive":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "info":
      case "default":
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getToastClasses = (variant) => {
    const baseClasses = "shadow-lg rounded-lg border-l-4 p-4 backdrop-blur-sm";
    
    switch (variant) {
      case "success":
        return `${baseClasses} bg-green-50 border-green-500 text-green-800`;
      case "error":
      case "destructive":
        return `${baseClasses} bg-red-50 border-red-500 text-red-800`;
      case "warning":
        return `${baseClasses} bg-amber-50 border-amber-500 text-amber-800`;
      case "info":
        return `${baseClasses} bg-blue-50 border-blue-500 text-blue-800`;
      case "default":
      default:
        return `${baseClasses} bg-white border-gray-300 text-gray-800`;
    }
  };

  const getPositionClasses = (position) => {
    switch (position) {
      case "top-left":
        return "fixed top-4 left-4 z-50";
      case "top-center":
        return "fixed top-4 left-1/2 -translate-x-1/2 z-50";
      case "top-right":
        return "fixed top-4 right-4 z-50";
      case "bottom-left":
        return "fixed bottom-4 left-4 z-50";
      case "bottom-center":
        return "fixed bottom-4 left-1/2 -translate-x-1/2 z-50";
      case "bottom-right":
      default:
        return "fixed bottom-4 right-4 z-50";
    }
  };

  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || "bottom-right";
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {});

  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}
      
      {/* Render toast groups by position */}
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div key={position} className={`${getPositionClasses(position)} flex flex-col gap-3 max-w-md w-full`}>
          <AnimatePresence>
            {positionToasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`${getToastClasses(toast.variant)} w-full max-w-md pointer-events-auto`}
                layout
                onMouseEnter={() => {
                  if (toast.timeoutId) {
                    clearTimeout(toast.timeoutId);
                  }
                }}
                onMouseLeave={() => {
                  const newTimeoutId = setTimeout(() => {
                    dismissToast(toast.id);
                  }, 2000);
                  
                  setToasts(prev => 
                    prev.map(t => t.id === toast.id ? { ...t, timeoutId: newTimeoutId } : t)
                  );
                }}
              >
                <div className="flex items-start">
                  {toast.icon && (
                    <div className="flex-shrink-0 mr-3">
                      {getToastIcon(toast.variant)}
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm">{toast.title}</h4>
                    {toast.description && (
                      <p className="text-xs mt-1 opacity-90">{toast.description}</p>
                    )}
                  </div>
                  
                  {toast.dismissible && (
                    <button
                      onClick={() => dismissToast(toast.id)}
                      className="ml-3 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity focus:outline-none"
                      aria-label="Close"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </ToastContext.Provider>
  );
};


export { ToastContext, ToastProvider };