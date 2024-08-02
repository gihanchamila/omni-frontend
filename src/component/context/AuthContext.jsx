import { createContext, useState, useEffect} from "react";
import { useNavigate, useLocation, json } from "react-router-dom";
import PropTypes from "prop-types";

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
  
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const stringifyBlogData = window.localStorage.getItem("blogData");
      if (stringifyBlogData) {
        const blogData = JSON.parse(stringifyBlogData);
        const user = blogData.user;
        setAuth(user);
      } else {
        setAuth(null);
      }
    }, [navigate, location]);
  
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
  };
  

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}