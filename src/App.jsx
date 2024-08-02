import { Routes, Route } from "react-router-dom"
import "react-toastify/ReactToastify.css"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

import PrivateLayout from "./component/layout/PrivateLayout.jsx";
import PublicLayout from "./component/layout/PublicLayout.jsx";

import Home from "./pages/Home.jsx";

import CategoryList from "./pages/category/CategoryList.jsx";

import PostList from "./pages/post/PostList.jsx";

import Profile from "./pages/Profile.jsx";
import Setting from "./pages/Setting.jsx"

import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx"


function App() {
  
  return (
    <>
      <Routes>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="posts" element={<PostList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="setting" element={<Setting />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />}/>
        </Route>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
