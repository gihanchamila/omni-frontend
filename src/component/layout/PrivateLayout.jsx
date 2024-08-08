import { Navigate, Outlet } from "react-router-dom";
import PrivateNavBar from "../PrivateNavBar.jsx"
import { useAuth } from "../context/useAuth.jsx";

const PrivateLayout = () => {
    const auth = useAuth()

    if(!auth){
        return <Navigate to="/login" />
    }

    return (
        <>
            <PrivateNavBar />
            <Outlet />
        </>
    )
}

export default PrivateLayout