import axios from "axios";

// Create an axios instance
// For the vercel

// const axiosInstance = axios.create({baseURL: import.meta.env.VITE_API_URL })

// For the localhost
const axiosInstance = axios.create({baseURL: "http://localhost:8000/api/v1"})

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