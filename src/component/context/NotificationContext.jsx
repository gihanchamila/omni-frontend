import React, {createContext, useState, useEffect} from 'react'
import axios from '../../utils/axiosInstance';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
    const auth = useAuth();
    const [notifications, setNotifications] = useState([])
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
          console.log(error)
          const data = response.data;
          toast.error(data.message);

        }
    };

    const deleteNotification = async (id) => {
      try {
        const response = await axios.delete("/notification/delete-notification", { notificationId: id });
        const updatedNotification = response.data.data;

        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: updatedNotification.isRead } : n))
        );
        setUnreadCount((prev) => prev - 1);
      } catch (error) {
        const response = error.response;
        console.log(error)
        const data = response.data;
        toast.error(data.message);

      }
  };

    const addNotifications = (message, type = "success") => {
        setNotifications((prev) => [...prev, {message, type, id: Date.now()}]);
    };

    const clearNotifications = () => setNotifications([]);

    useEffect(() => {
        fetchNotifications();
      }, [auth]);
    

    return (
        <NotificationContext.Provider value={{addNotifications, notifications, markAsRead, clearNotifications, deleteNotification }}>
            {children}
        </NotificationContext.Provider>
    )
}