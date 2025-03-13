import { Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react";
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

const Home = lazy(() => import("./pages/Home.jsx"));
const CategoryList = lazy(() => import("./pages/category/CategoryList.jsx"));
const NewCategory = lazy(() => import("./pages/category/NewCategory.jsx"));
const UpdateCategory = lazy(() => import("./pages/category/UpdateCategory.jsx"));

const PostList = lazy(() => import("./pages/post/PostList.jsx"));
const SinglePost = lazy(() => import("./pages/post/SinglePost.jsx"));
const NewPost = lazy(() => import("./pages/post/NewPost.jsx"));
const UpdatePost = lazy(() => import("./pages/post/Updatepost.jsx"));

const Profile = lazy(() => import("./pages/Profile.jsx"));
const Setting = lazy(() => import("./pages/Setting.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.jsx"));
const Users = lazy(() => import("./pages/Users.jsx"));
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const AdminList = lazy(() => import("./pages/AdminList.jsx"));
const NotificationList = lazy(() => import("./pages/NotificationList.jsx"));

function App() {
  
  return (
    <>
    <div className="bg-white dark:bg-slate-900 min-w-screen min-h-screen ">
      <div className="relative container">
        <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
          <Routes>
            <Route element={<PrivateLayout />}>
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
              <Route path="our-story" element={<HomePage />} />
              <Route path="forgot-password" element={<ForgotPassword />}/>
            </Route>
          </Routes>
        </Suspense>
        
        {/* 
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
            }}
          /> 
        */}
      </div>
    </div>
      
    </>
  )
}

export default App
