import { createContext, useState } from "react";
import useNotificationActions from "../hooks/useNotificationActions";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const {
    getUserNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications,
    countUnread,
  } = useNotificationActions();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserNotifications = async (userId) => {
    setLoading(true);
    try {
      const res = await getUserNotifications(userId);
      if (!res) {
        console.log('No notifications found');
        throw new Error('No notifications found');
      }
      setNotifications(res);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError("Error fetching notifications.");
      console.log("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async (userId) => {
    setLoading(true);
    try {
      const res = await countUnread(userId);
      if (!res) {
        console.log('No unread notifications found');
        throw new Error('No unread notifications found');
      }
      setUnreadCount(res);
      setLoading(false);
      return res.data;
    } catch (error) {
      setError("Error fetching unread count.");
      console.log("Error fetching unread count:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        fetchUserNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        createNotification,
        deleteNotification,
        deleteReadNotifications,
        notifications,
        unreadCount,
        loading,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider, NotificationContext };
