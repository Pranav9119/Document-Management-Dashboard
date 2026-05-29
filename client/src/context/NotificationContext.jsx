import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getNotifications, markRead as markReadAPI, markAllRead as markAllReadAPI } from '../services/api';
import { useSocket } from './SocketContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast]                 = useState(null); // { message, type }
  const socket = useSocket();

  /* ── Fetch all notifications from backend ── */
  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /* ── Listen for real-time socket events ── */
  useEffect(() => {
    if (!socket) return;

    const handler = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setToast({ message: notif.message, type: notif.type });
    };

    socket.on('notification', handler);
    return () => socket.off('notification', handler);
  }, [socket]);

  /* ── Derived state ── */
  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ── Actions ── */
  const markRead = async (id) => {
    try {
      await markReadAPI(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('markRead error:', err.message);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllReadAPI();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('markAllRead error:', err.message);
    }
  };

  const showToast = (message, type = 'info') => setToast({ message, type });
  const hideToast = ()                        => setToast(null);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, fetchNotifications, toast, showToast, hideToast }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
