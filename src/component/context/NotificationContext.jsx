// filepath: /d:/Projects/Non academic/omni-frontend/src/component/context/NotificationContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { useSocket } from '../../hooks/useSocket.jsx';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const auth = useAuth();
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/notification/get-notifications");
      const data = response.data.data;
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await axios.put("/notification/mark-as-read", { notificationId: id });
      const updatedNotification = response.data.data;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: updatedNotification.isRead } : n))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      const response = error.response;
      console.log(error);
      const data = response.data;
      toast.error(data.message);
    }
  };

  const deleteNotification = async (id) => {
    try {
    await axios.delete(`/notification/delete-notification/${id}`);
      // Emit socket event for notification deletion
      if (socket) {
        socket.emit('notification-deleted', { notificationId: id });
      }

      // Update state
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => prev - 1);
      toast.success("Notification deleted successfully");
    } catch (error) {
      const response = error.response;
      const data = response?.data;
      toast.error(data?.message || "Failed to delete notification");
    }
  };

  const addNotifications = (message, type = "success") => {
    setNotifications((prev) => [...prev, { message, type, id: auth._id }]);
  };

  const clearNotifications = () => setNotifications([]);

  useEffect(() => {
    fetchNotifications();
  }, [auth]);

  useEffect(() => {
    if (socket) {
      socket.on('new-notification', (data) => {
        console.log('New notification added:', data);
        setNotifications((prev) => [...prev, data]);
        setUnreadCount((prev) => prev + 1);
      });

      socket.on('notification-marked-as-read', (data) => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === data.notificationId ? { ...n, isRead: data.isRead } : n
          )
        );
        setUnreadCount((prev) => prev - 1);
      });

      socket.on('notification-deleted', (data) => {
        console.log('Notification deleted', data);
        setNotifications((prev) =>
          prev.filter((n) => n.id !== data.notificationId)
        );
        setUnreadCount((prev) => prev - 1);
      });

      socket.on("newComment", (data) => {
        console.log('New comment added:', data);
        setNotifications((prev) => [
          ...prev,
          { message: `New comment on post ${data.postId}`, type: 'info', id: data.comment._id }
        ]);
        setUnreadCount((prev) => prev + 1);
      });

      socket.on('new-reply', (data) => {
        console.log('New reply added:', data);
        setNotifications((prev) => [
          ...prev,
          { message: `New reply on post ${data.postId}`, type: 'info', id: data.reply._id }
        ]);
        setUnreadCount((prev) => prev + 1);
      });
    }
    return () => {
      if (socket) {
        socket.off('new-notification');
        socket.off('notification-marked-as-read');
        socket.off('notification-deleted');
        socket.off('newComment');
        socket.off('new-reply');
      }
    };
  }, [socket]);

  return (
    <NotificationContext.Provider value={{ addNotifications, setNotifications, notifications, markAsRead, clearNotifications, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};