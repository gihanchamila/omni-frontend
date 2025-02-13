import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";

export const useNotification = () => {
    const notification = useContext(NotificationContext)
    return notification
}