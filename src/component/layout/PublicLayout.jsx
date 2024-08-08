import { Navigate, Outlet } from "react-router-dom";
import PublicNavBar from "../PublicNavBar.jsx"
import { useAuth } from "../context/useAuth.jsx";

const PublicLayout = () => {
    const auth = useAuth()

    if(auth){
        return <Navigate to="/" />
    }

    return (
        <>
            <PublicNavBar />
            <Outlet />
        </>
    )
}

export default PublicLayout