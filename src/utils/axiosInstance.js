import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create({baseURL : "http://localhost:8000/api/v1"})

// Add a request interceptor
axiosInstance.interceptors.request.use((req) => {
    // Get the blog data from local storage
    const stringifyBlogData = window.localStorage.getItem("blogData")

    // If the blog data exists, set the token in the request header
    if(stringifyBlogData){
        // Parse the blog data
        const blogData = JSON.parse(stringifyBlogData)
        // Get the token from the blog data
        const token = blogData.token

        // Set the token in the request header
        req.headers.Authorization = `Bearer ${token}`
    }

    // Return the request
    return req;
})

export default axiosInstance;