import React, { useState, useRef, useEffect, useCallback } from "react";
import Button from "../button/Button.jsx";
import { useDropzone } from "react-dropzone";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { RiCloseLargeFill } from "react-icons/ri";
import axios from "../../utils/axiosInstance.js";
import { toast } from "sonner";
import { useSocket } from "../context/useSocket.jsx";
import useClickOutside from "../context/useClickOutside.jsx";
import imageCompression from "browser-image-compression";

function UpdateProfilePictureModal() {
  const socket = useSocket();
  const modalRef = useRef(null);
  const lastFocusedElement = useRef(null);
  const cropperRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const profilePicId = useRef(null);
  const deleteProfileKey = useRef(null);
  const tempProfileKey = useRef(null);
  const currentUser = useRef(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await axios.get("/auth/current-user");
        if (data?.data?.user) {
          currentUser.current = data.data.user;
          if (data.data.user.profilePic?.key) {
            deleteProfileKey.current = data.data.user.profilePic.key;
            profilePicId.current = data.data.user.profilePic._id;
          }
        } else {
          toast.error("User data is incomplete");
        }
      } catch (error) {
        toast.error("Error getting user");
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (removeModal || showModal) {
      lastFocusedElement.current = document.activeElement;
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "auto";
      lastFocusedElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = "auto";
      lastFocusedElement.current?.focus();
    };
  }, [removeModal, showModal]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return toast.error("No file selected");
  
    const file = acceptedFiles[0];
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      return toast.error("Invalid file type");
    }
  
    try {
      const options = { 
        maxSizeMB: 1, // Target max size (1MB)
        maxWidthOrHeight: 800, // Resize if needed
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      
      setFile(compressedFile);
      setImage(URL.createObjectURL(compressedFile));
    } catch (error) {
      toast.error("Image compression failed");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
  });

  const handleCloseModal = () => {
    setImage(null);
    setFile(null);
    setCroppedImage(null);
    setShowModal(false);
  };

  const handleCloseRemoveModal = () => {
    setRemoveModal(false);
};

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      setCroppedImage(cropper.getCroppedCanvas({ width: 500, height: 500 }).toDataURL());
    }
  };

  const handleSaveProfilePicture = async () => {
    if (!croppedImage) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post("/file/upload", { base64Image: croppedImage });

      if (!data?.data?.id) throw new Error("File ID missing");

      profilePicId.current = data.data.id;
      tempProfileKey.current = data.data.key;

      await axios.post("/user/add-profilePic", { profilePic: data.data.id });

      socket.emit("profilePicUpdated", { userId: currentUser.current._id, signedUrl: tempProfileKey.current });

      toast.success("Profile picture updated successfully!");
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!profilePicId.current) return;

    try {
      await axios.delete(`/user/remove-profilePic?id=${profilePicId.current}`);
      profilePicId.current = null;
      deleteProfileKey.current = null;
      tempProfileKey.current = null;

      toast.success("Profile picture removed successfully!");
      setRemoveModal(false);
      socket.emit("profilePicRemoved", { userId: currentUser.current._id });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete profile picture");
    }
  };

  useClickOutside(modalRef, () => setShowModal(false));

  return (
    <div>
      <div className="space-x-4">
        <Button variant="error" onClick={() => setRemoveModal(true)}>
          Remove
        </Button>
        <Button variant="info" onClick={() => setShowModal(true)}>
          Change Profile Picture
        </Button>
      </div>

      {removeModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-hidden'>
                    <div className="relative bg-white sm:m-5 rounded-lg p-8 w-[25rem] max-w-full space-y-4 flex flex-col justify-between">
                        <button
                            onClick={handleCloseRemoveModal}
                            className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                        >
                            <RiCloseLargeFill className="w-4 h-4 transition-colors duration-200" />
                        </button>
                        <span className='sm:text-gray-500 dark:lg:text-gray-500'>Are you sure to remove profile picture?</span>
                        <div className='flex justify-end space-x-4'>
                            <Button variant='outline' onClick={handleCloseRemoveModal}>No</Button>
                            <Button variant='error' onClick={handleDeleteFile}>Yes</Button>  
                        </div>
                    </div>
                </div>
            )}

      {showModal && (
        <div ref={modalRef} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white sm:m-5 rounded-lg p-8 w-[50rem] h-[35rem] max-w-full space-y-4 flex flex-col justify-between">
            <button onClick={handleCloseModal} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700">
              <RiCloseLargeFill className="w-4 h-4 transition-colors duration-200" />
            </button>
            <span className="text-2xl font-bold">Update Profile Picture</span>

            <div className="flex flex-col items-center justify-center flex-grow">
              {!image && !croppedImage && (
                <div {...getRootProps()} className={`border-2 w-full h-[20rem] border-dashed p-6 text-center ${isDragActive ? "bg-gray-100" : "bg-gray-50"} rounded-lg`}>
                  <input {...getInputProps()} />
                  <p className="text-gray-500">{isDragActive ? "Drop the files here..." : "Drag & drop or click to select a file"}</p>
                </div>
              )}
              {image && !croppedImage && <Cropper src={image} style={{ height: "300px", width: "100%" }} aspectRatio={1} ref={cropperRef} />}
              {croppedImage && <img src={croppedImage} alt="Cropped" className="w-[300px] h-[300px] rounded-full object-cover" />}
            </div>
            <div className="flex justify-end">
            <Button variant="info" onClick={croppedImage ? handleSaveProfilePicture : handleCrop}>
              {croppedImage ? (isLoading ? "Saving..." : "Save Changes") : "Next"}
            </Button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateProfilePictureModal;
