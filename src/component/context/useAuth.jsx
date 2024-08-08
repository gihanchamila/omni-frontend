import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

export const useAuth = () => {
    const auth = useContext(AuthContext)
    return auth
}
