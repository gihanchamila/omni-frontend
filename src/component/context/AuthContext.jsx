import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode"; // Install this package if not already installed

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stringifyBlogData = window.localStorage.getItem("blogData");
    if (stringifyBlogData) {
      const blogData = JSON.parse(stringifyBlogData);
      const token = blogData.token;

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        if (decodedToken.exp < currentTime) {
          // Token is expired
          window.localStorage.removeItem("blogData");
          setAuth(null);
          navigate("/login", { state: { from: location }, replace: true });
        } else {
          setAuth(blogData.user);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setAuth(null);
        navigate("/login", { state: { from: location }, replace: true });
      }
    } else {
      setAuth(null);
    }
  }, [navigate, location]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};