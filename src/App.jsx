import { Routes, Route } from "react-router-dom"
import { motion } from "framer-motion";

import { Toaster } from "sonner";
import { HiCheckCircle } from "react-icons/hi";
import { HiInformationCircle } from "react-icons/hi";
import { HiExclamationCircle } from "react-icons/hi";
import { HiExclamation } from "react-icons/hi";
import { HiOutlineXMark } from "react-icons/hi2";

import './index.css'

import PrivateLayout from "./component/layout/PrivateLayout.jsx";
import PublicLayout from "./component/layout/PublicLayout.jsx";

import Home from "./pages/Home.jsx";

import CategoryList from "./pages/category/CategoryList.jsx";
import NewCategory from "./pages/category/NewCategory.jsx"
import UpdateCategory from "./pages/category/UpdateCategory.jsx";

import PostList from "./pages/post/PostList.jsx";
import SinglePost from "./pages/post/SinglePost.jsx";
import NewPost from "./pages/post/NewPost.jsx"
import UpdatePost from "./pages/post/Updatepost.jsx";

import Profile from "./pages/Profile.jsx";
import Setting from "./pages/Setting.jsx"

import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx"
import UserProfile from "./pages/UserProfile.jsx";
import Users from "./pages/Users.jsx";
import HomePage from "./pages/HomePage.jsx";
import AdminList from "./pages/AdminList.jsx";

import NotificationList from "./pages/NotificationList.jsx";

function App() {
  
  return (
    <>
    <div className="bg-white dark:bg-slate-900 min-w-screen min-h-screen ">
      <div className="relative container">
        <Routes>
            <Route element={<PrivateLayout />}>
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="categories" element={<CategoryList />} />
              <Route path="categories/new-category" element={<NewCategory />} />
              <Route path="categories/update-category/:id" element={<UpdateCategory />} />
              <Route path="users" element={<Users />} />
              <Route path="/" element={<PostList />} />
              <Route path="posts/:id" element={<SinglePost />} />
              <Route path="posts/new-post" element={<NewPost />} />
              <Route path="posts/update-post/:id" element={<UpdatePost/>} />
              <Route path="/:id" element={<Profile />} />
              <Route path="user-profile/:id" element={<UserProfile/>} />
              <Route path="settings" element={<Setting />} />
              <Route path="dashboard" element={<Home/>} />
              <Route path="admin-list" element={<AdminList/>} />
              <Route path="notifications" element={<NotificationList/>} />
            </Route>
            <Route element={<PublicLayout />}>
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />}/>
              {/* <Route path="/" element={< />} /> */}
              <Route path="our-story" element={<HomePage />} />
            </Route>
        </Routes>
        <Toaster  closeButton={<HiOutlineXMark />} description
        toastOptions={{
          unstyled: true,
          classNames: {
            error: 'toast error',
            success: 'toast success',
            warning: 'toast warning',
            info: 'toast info',
            title: 'toastTitle',
            closeButton: 'closeButton',
            description: 'pt-2'
          },
        }}

        icons={{
          success: <HiCheckCircle className="iconSize" />,
          info: <HiInformationCircle className="iconSize" />,
          error: <HiExclamationCircle className="iconSize" />,
          warning: <HiExclamation className="iconSize" /> 
        }}/>
      </div>
    </div>
      
    </>
  )
}

export default App
