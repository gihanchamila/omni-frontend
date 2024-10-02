import { useContext } from "react";
import { ProfileContext } from "./ProfileContext.jsx";

export const useProfile = () => {
    const  profile = useContext(ProfileContext)
    return profile
}
