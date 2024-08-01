import { createContext, useState, useEffect} from "react";
import { useNavigate, useLocation, json } from "react-router-dom";
import PropTypes from "prop-types";

export const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const fetchAuthData = () => {
            try{
                const stringifyBlogData = window.localStorage.getItem("blogData")
    
                if(stringifyBlogData){
                    const blogData = json.parse(stringifyBlogData)
                    setAuth(blogData.user || null)
                }else {
                    setAuth(null)
                }

            }catch(error){
                console.log("Failed to parse blogData:", error)
            }
        }

        fetchAuthData()

    }, [navigate, location])

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };