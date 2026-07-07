import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  }, [hideToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={hideToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Internal Toast Item Component
const ToastItem: React.FC<{ toast: ToastMessage; onClose: (id: string) => void }> = ({
  toast,
  onClose,
}) => {
  const { id, message, type } = toast;

  const iconMap = {
    success: <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    warning: <FiAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    info: <FiInfo className="w-5 h-5 text-brand-blue-600 flex-shrink-0" />,
  };

  const bgMap = {
    success: 'bg-emerald-50 border-emerald-100',
    warning: 'bg-amber-50 border-amber-100',
    error: 'bg-red-50 border-red-100',
    info: 'bg-brand-blue-50 border-brand-blue-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      layout
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-premium w-full ${bgMap[type]} relative overflow-hidden`}
    >
      {iconMap[type]}
      <div className="flex-1 text-sm font-medium text-slate-800 leading-tight">
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg focus-ring min-h-0 flex items-center justify-center"
        aria-label="Close notification"
      >
        <FiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
