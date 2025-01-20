import { Navigate, Outlet } from "react-router-dom";
import PrivateNavBar from "../PrivateNavBar.jsx"
import { useAuth } from "../context/useAuth.jsx";
import FooterSiteMap from "../FooterSiteMap.jsx";

const PrivateLayout = () => {
    const auth = useAuth()

    if(!auth){
        return <Navigate to="/login" />
    }

    return (
        <>
             <div className="flex flex-col min-h-screen">
                {/* Navbar */}
                <PrivateNavBar />

                {/* Main Content */}
                <div className="flex-1">
                    <Outlet />
                </div>

                {/* Footer */}
                <FooterSiteMap />
            </div>
        </>
    )
}

export default PrivateLayout