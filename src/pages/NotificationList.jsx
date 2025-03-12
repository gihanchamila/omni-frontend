import React, { useState } from 'react'
import { useNotification } from '../component/context/useNotification'
import Button from '../component/button/Button';
import { useSocket } from '../component/context/useSocket';
import { useCallback } from 'react';
// import { toast } from 'sonner';

const NotificationList = () => {

  const { notifications, setNotifications, markAsRead, deleteNotification, clearNotifications } = useNotification();
  const [loading, setLoading] = useState(false)
  const socket = useSocket()

  const handleDelete = useCallback(async (e, id) => {
    e.stopPropagation(); 
    setLoading(true);
    try {

      if (!id) {
        console.error("Notification ID is missing");
        return;
      }
      if (socket) {
        socket.emit('notification-deleted', { notificationId: id });
      }

      await deleteNotification(id); 
      await setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== id)
      );

    } catch (error) {
      console.error("Failed to delete notification", error);
      // toast.error("Failed to delete notification");
    } finally {
      setLoading(false);
    }
  }, [deleteNotification, socket, setNotifications]);
  
  return (
    <div className="">
      <div>
        <h2 className='title'>Notifications</h2>
      </div>
      <div className='bg-gray-50 rounded-xl p-4'>
        {notifications.length === 0 ? (
          <div className="flex justify-center items-center">
            <p className="text-center justify-center  text-gray-500 font-semibold p-4  rounded-lg ">
              No notifications to display
            </p>
          </div>
          ) : (
            <div className="">
            <div>
            {notifications.map((notification) => (
                <div
                key={notification.id}
                className="flex justify-between items-center py-3"
                >
                    <div className="flex-1">
                        {notification.isRead ? (
                          <p className="text-gray-800 lg:text-md font-regular sm:text-sm">{notification.message}</p>
                      ) : (
                        <p className="text-gray-800 lg:text-md font-regular font-semibold sm:text-sm">{notification.message}</p>
                      )}
                        <span className="lg:text-md sm:text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                        </span>             
                    </div>
                    <div className="flex space-x-3">
                        <Button
                        variant={'info'}
                        onClick={(e) => markAsRead(e, notification._id)}
                        className="sm:px-2 sm:py-1 sm:rounded-md sm:text-xs"
                        >
                        Mark as Read
                        </Button>
                        <Button
                        variant={'error'}
                        onClick={(e) => handleDelete(e, notification._id)}
                        className="sm:px-2 sm:py-1 sm:rounded-md sm:text-xs"
                        >
                        Delete
                        </Button>
                    </div>
                    <div className='bg-gray-500 border'/>
                </div>
            ))}
            </div>
            </div>
            )}
      </div>
    </div>
  )
}

export default NotificationList