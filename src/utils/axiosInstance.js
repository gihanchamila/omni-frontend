import axios from "axios";

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
