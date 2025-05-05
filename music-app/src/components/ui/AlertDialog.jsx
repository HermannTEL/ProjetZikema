// Alert Dialog Components
export function AlertDialog({ children, ...props }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" {...props}>
      {children}
    </div>
  );
}

export function AlertDialogContent({ children, ...props }) {
  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[85vh] overflow-auto p-6" {...props}>
      {children}
    </div>
  );
}

export function AlertDialogHeader({ children, ...props }) {
  return (
    <div className="flex flex-col space-y-1.5 pb-4" {...props}>
      {children}
    </div>
  );
}

export function AlertDialogTitle({ children, ...props }) {
  return (
    <h2 className="text-lg font-semibold leading-none tracking-tight" {...props}>
      {children}
    </h2>
  );
}

export function AlertDialogDescription({ children, ...props }) {
  return (
    <p className="text-sm text-gray-500" {...props}>
      {children}
    </p>
  );
}

export function AlertDialogFooter({ children, ...props }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4" {...props}>
      {children}
    </div>
  );
}

export function AlertDialogAction({ children, ...props }) {
  return (
    <button 
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4"
      {...props}
    >
      {children}
    </button>
  );
}

export function AlertDialogCancel({ children, ...props }) {
  return (
    <button 
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 h-10 py-2 px-4"
      {...props}
    >
      {children}
    </button>
  );
}