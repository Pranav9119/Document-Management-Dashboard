import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
          <Bell size={24} />
        </div>
        <p>No notifications yet</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'error':   return <AlertCircle className="text-red-500" size={20} />;
      case 'warning': return <AlertCircle className="text-amber-500" size={20} />;
      default:        return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notif) => (
        <div
          key={notif._id}
          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 ${
            !notif.read ? 'bg-blue-50/30' : ''
          }`}
        >
          <div className="mt-1 flex-shrink-0">{getIcon(notif.type)}</div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${!notif.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
              {notif.message}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
            </p>
          </div>
          {!notif.read && (
            <button
              onClick={() => markRead(notif._id)}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors h-fit self-center"
              title="Mark as read"
            >
              <Check size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationDropdown;
