import { useEffect, useState } from "react";
import axios from '../utils/axiosInstance.js'
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { coverPhoto, profilePic } from "../assets/index.js";
import { GoVerified } from "react-icons/go";
import { FaLinkedin, FaFacebookSquare, FaInstagramSquare} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import Button from './../component/button/Button.jsx'

const Profile = () => {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState()
  const [followers, setFollowers] = useState()
  const [following, setFollowing] = useState()
  

  useEffect(() => {
    const getCurrentUser = async () => {
    try {
      const response = await axios.get(`/auth/current-user`);
      const user = response.data.data.user;  
      if (user && user._id) {
          setCurrentUser(user); 
          toast.success(`Your name is ${user.name}`); 
      } else {
          toast.error('User data is incomplete');
      }
    }catch(error){
      toast.error('Error getting user');
      console.log(error)
    }
    };
    getCurrentUser();
},[]);



useEffect(() => {
  const getFollowers = async () => {
    try{
      const response = await axios.get(`/user/followers/${id}`)
      const followersCount = response.data.data.followersCount;
      setFollowers(followersCount);
    }catch(error){
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  }
  getFollowers()
}, [id])

useEffect(() => {
  const getFollowing = async () => {
    try{
      const response = await axios.get(`/user/following/${id}`)
      const followingCount = response.data.data.followingCount;
      console.log(followingCount)
      setFollowing(followingCount);
    }catch(error){
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  }
  getFollowing()
}, [id])

console.log(currentUser)


  return (
    <div className="flex flex-col">
      <div className="flex flex-col ">
        <div className="flex relative flex-col items-center bg-gray-200">
          <img src={coverPhoto} className=" object-cover bg-gray-500 h-[15rem] w-full rounded-lg flex  justify-center" />
          <img src={profilePic} className="absolute  bg-red-500 object-cover rounded-full h-[10rem] w-[10rem] left-1/2 transform -translate-x-1/2 bottom-[-4.5rem]" />  
        </div>
      </div>
      <div className="relative flex flex-col justify-center items-center mt-[5rem] space-y-2">
        <div className="flex items-center justify-center space-y-2">
          <div>
          {currentUser ? (
              <div className="flex items-center justify-center space-y-2">
                <div>
                  <span className="h3 font-bold align-middle mb-0 relative">{currentUser.name}</span>
                </div>
              </div>
            ) : (
              <p>Loading user data...</p>
          )}
            {/*<GoVerified className="absolute lg:right-[31.5rem] lg:top-1 sm:right-[7.2rem] sm:top-[0.08rem] ml-2 mt-1 w-5 h-5 text-blue-500" /> */}
          </div>
        </div>
         {/**/}
         <div className="absolute lg:top-[2.8rem] sm:top-[2.2rem] flex space-x-2">
          <FaLinkedin className="social " />
          <FaFacebookSquare className="social " />
          <FaInstagramSquare className="social "/>
          <FaSquareXTwitter className="social "/>
        </div>   
      </div>
      <p className="lg:mt-9 sm:mt-10 text-md text-center">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
      <div className="flex lg:space-x-2 justify-between lg:px-[26rem]  sm:mx-[4rem] mt-4">
        <p className="profile-details">followers : {followers}</p>
        <p className="profile-details">following : {following}</p>
        <p className="profile-details">Posts : 20</p>
      </div>
      
    </div>
    
  );
}

export default Profile;