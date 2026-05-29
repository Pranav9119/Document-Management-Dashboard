import { useNotifications } from '../context/NotificationContext';
import { X, CheckCircle2, Info } from 'lucide-react';
import { useEffect } from 'react';

const Toast = () => {
  const { toast, hideToast } = useNotifications();

  // Auto-dismiss after 5 seconds if not explicitly closed
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
        isSuccess ? 'bg-green-50 border-green-200 text-green-800' : 'bg-blue-50 border-blue-200 text-blue-800'
      }`}>
        {isSuccess ? <CheckCircle2 size={20} className="text-green-600" /> : <Info size={20} className="text-blue-600" />}
        <p className="font-medium pr-6">{toast.message}</p>
        <button
          onClick={hideToast}
          className={`absolute top-1/2 -translate-y-1/2 right-2 p-1 rounded-lg hover:bg-black/5 transition-colors`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
