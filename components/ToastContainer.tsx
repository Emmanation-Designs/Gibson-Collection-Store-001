
import React from 'react';
import { useToast } from '../store/useToast';
import { X, CheckCircle2, AlertCircle, Info, Check } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 md:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto relative overflow-hidden w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/50 animate-in slide-in-from-right-10 fade-in duration-300 group"
          role="alert"
        >
          {/* Progress Bar */}
          <div className={`absolute bottom-0 left-0 h-1 animate-progress ${
             toast.type === 'success' ? 'bg-green-500' :
             toast.type === 'error' ? 'bg-red-500' :
             'bg-blue-500'
          }`} />

          <div className="p-4 flex items-start gap-4">
            {/* Icon Box */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${
               toast.type === 'success' ? 'bg-green-100 text-green-600' :
               toast.type === 'error' ? 'bg-red-100 text-red-600' :
               'bg-blue-100 text-blue-600'
            }`}>
              {toast.type === 'success' && <Check className="w-6 h-6" />}
              {toast.type === 'error' && <AlertCircle className="w-6 h-6" />}
              {toast.type === 'info' && <Info className="w-6 h-6" />}
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <h4 className={`text-base font-bold mb-0.5 ${
                 toast.type === 'success' ? 'text-gray-800' :
                 toast.type === 'error' ? 'text-red-700' :
                 'text-gray-800'
              }`}>
                {toast.type === 'success' ? 'Success!' : toast.type === 'error' ? 'Error' : 'Notification'}
              </h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100 -mt-1 -mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
