import axios from "axios";

// Create an axios instance
// Set the base URL to the API server URL 
// import.meta.env.VITE_API_URL is the URL of the API server in backend on railway "https://omni-backend-production.up.railway.app"
// The URL is stored in the .env file in the root directory of the frontend project

const axiosInstance = axios.create({baseURL: import.meta.env.VITE_API_URL })

// Add a request interceptor
axiosInstance.interceptors.request.use((req) => {
    const stringifyBlogData = window.localStorage.getItem("blogData")
    if(stringifyBlogData){
        const blogData = JSON.parse(stringifyBlogData)
        const token = blogData.token
        req.headers.Authorization = `Bearer ${token}`
    }
    return req;
})

export default axiosInstance;
