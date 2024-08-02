import { Navigate, Outlet } from "react-router-dom";
import PublicNavBar from "../PublicNavBar.jsx"

const PublicLayout = () => {
    const auth = false

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