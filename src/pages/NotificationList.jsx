import React from 'react'
import { useNotification } from '../component/context/useNotification'
import Button from '../component/button/Button';

const NotificationList = () => {

  const { notifications, setNotifications, markAsRead, deleteNotification, clearNotifications } = useNotification();

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
                        onClick={() => markAsRead(notification.id)}
                        className="sm:px-2 sm:py-1 sm:rounded-md sm:text-xs"
                        >
                        Mark as Read
                        </Button>
                        <Button
                        variant={'error'}
                        onClick={() => deleteNotification(notification.id)}
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