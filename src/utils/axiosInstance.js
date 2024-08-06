import axios from "axios";
import { json } from "react-router-dom";

const axiosInstance = axios.create({baseURL : "http://localhost:8000/api/v1"})

axiosInstance.interceptors.request.use((req) => {
    const stringifyBlogData = window.localStorage.getItem("blogData")
    if(stringifyBlogData){
        const blogData = JSON.parse(stringifyBlogData)
        const token = blogData.token

        req.headers.Authorization = `Bearer ${token}`
    }

    return req
})

export default axiosInstance;