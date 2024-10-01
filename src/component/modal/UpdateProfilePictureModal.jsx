import React, { useState, useRef, useEffect, useMemo } from 'react';
import Button from '../button/Button.jsx';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { RiCloseLargeFill } from "react-icons/ri";
import axios from "../../utils/axiosInstance.js";
import { toast } from 'sonner';
import { useSocket } from '../../hooks/useSocket.jsx';

function UpdateProfilePictureModal() {
    // State management
    const socket = useSocket();
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [removeModal, setRemoveModal] = useState(false);
    const [file, setFile] = useState(null);
    const [fileId, setFileId] = useState(null);
    const [profileKey, setProfileKey] = useState(null)
    const [tempProfileKey, setTempProfileKey] = useState(null)
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [deleteProfileKey, setDeleteProfileKey] = useState(null);
    const cropperRef = useRef(null);
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await axios.get('/auth/current-user');
                const user = response.data.data.user;

                if (user && user._id) {
                    setCurrentUser(user);
                    if (user.profilePic?.key) {
                        setDeleteProfileKey(user.profilePic.key);
                    }
                } else {
                    toast.error('User data is incomplete');
                }
            } catch (error) {
                toast.error('Error getting user');
            }
        };

        getCurrentUser();

        return () => setCurrentUser(null); // Clean up
    }, []);

    // useMemo to cache the profile picture key
    const memoizedProfilePicKey = useMemo(() => {
        return currentUser?.profilePic?.key || null;
    }, [currentUser])

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length === 0) {
            toast.error('No file selected');
            return;
        }

        const file = acceptedFiles[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
            setFile(file);
        } else {
            toast.error('Invalid file type');
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }
    })

    const handleCloseModal = () => {
        setImage(null);
        setFile(null);
        setCroppedImage(null);
        setShowModal(false);
    };

    const handleRecrop = () => setCroppedImage(null);

    const handleCloseRemoveModal = () => {
        setRemoveModal(false);
    }

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas({ width: 500, height: 500, fillColor: '#fff' });
            setCroppedImage(croppedCanvas.toDataURL());
        }
    }

    const handleSaveProfilePicture = async () => {
        if (croppedImage) {
            setIsLoading(true);
            try {
                const uploadResponse = await axios.post("/file/upload", { base64Image: croppedImage });
                if (uploadResponse.data?.data?.id) {
                    const fileId = uploadResponse.data.data.id;
                    console.log(uploadResponse.data.data.key)
                    const profileKey = uploadResponse.data.data.key
                    const profileResponse = await axios.post("/user/add-profilePic", { profilePic: fileId });

                    const response = await axios.get(`/file/signed-url?key=${profileKey}`) 
                    const data = response.data.data
                    console.log(data)
                    setTempProfileKey(data.url)
                    console.log(tempProfileKey)
                    
                    // Emit an event after successfully saving the profile picture
                    socket.emit('profilePicUpdated', { userId: currentUser._id, signedUrl: tempProfileKey});
    
                    toast.success(profileResponse.data.message);
                    handleCloseModal();
                } else {
                    throw new Error("File ID missing");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleDeleteFile = async () => {
        try {
            const response = await axios.delete(`file/delete-file?key=${memoizedProfilePicKey}`);
            toast.success(response.data.message);
            setRemoveModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting file");
        }
    }

    return (
        <div>
            <div className='space-x-4'>
                <Button variant='error' onClick={() => setRemoveModal(true)}>Remove</Button>
                <Button variant='info' onClick={() => setShowModal(true)}>Add Profile Picture</Button>
            </div>

            {/* Remove Modal */}
            {removeModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm'>
                    <div className="relative bg-white rounded-lg p-8 w-[25rem] max-w-full space-y-4 flex flex-col justify-between">
                        <button
                            onClick={handleCloseRemoveModal}
                            className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                        >
                            <RiCloseLargeFill className="w-4 h-4 transition-colors duration-200" />
                        </button>
                        <p>Are you sure to remove profile picture?</p>
                        <div className='flex justify-end space-x-4'>
                            <Button variant='error' onClick={handleDeleteFile}>Yes</Button>
                            <Button variant='info' onClick={handleCloseRemoveModal}>No</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Profile Picture Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                    <div className="relative bg-white rounded-lg p-8 w-[50rem] h-[35rem] max-w-full space-y-4 flex flex-col justify-between">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                        >
                            <RiCloseLargeFill className="w-4 h-4 transition-colors duration-200" />
                        </button>
                        <p className="text-2xl font-bold m-0">Update Profile Picture</p>

                        <div className="flex flex-col items-center justify-center flex-grow">
                            {!image && !croppedImage && (
                                <div
                                    {...getRootProps()}
                                    className={`flex items-center justify-center border-2 w-full h-[20rem] border-dashed p-6 text-center ${isDragActive ? 'bg-gray-100' : 'bg-gray-50'} rounded-lg`}
                                >
                                    <input {...getInputProps()} />
                                    <p className="text-gray-500">
                                        {isDragActive ? 'Drop the files here ...' : 'Drag & drop a picture here, or click to select a file'}
                                    </p>
                                </div>
                            )}

                            {image && !croppedImage && (
                                <div>
                                    <Cropper
                                        src={image}
                                        style={{ height: '300px', width: '100%' }}
                                        aspectRatio={1}
                                        guides={false}
                                        ref={cropperRef}
                                    />
                                </div>
                            )}

                            {croppedImage && (
                                <div className="w-[300px] h-[300px] rounded-full overflow-hidden bg-gray-200">
                                    <img src={croppedImage} alt="Cropped" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
                            {!croppedImage && image && <Button variant='info' onClick={handleCrop}>Next</Button>}
                            {croppedImage && <Button onClick={handleRecrop}>Recrop</Button>}
                            {croppedImage && (
                                <Button variant='info' onClick={handleSaveProfilePicture} disabled={isLoading}>
                                    {isLoading ? 'Saving changes...' : 'Save Changes'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateProfilePictureModal;
