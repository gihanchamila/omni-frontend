import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

export const useAuth = () => {
    const auth = useContext(AuthContext)

    if (auth === null) {
        throw new Error("useAuth must be used within an AuthProvider");
      }

    return auth
}