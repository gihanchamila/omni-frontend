import React, { useState, useRef } from 'react';
import Button from '../button/Button.jsx';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { RiCloseLargeFill } from "react-icons/ri";
import axios from "../../utils/axiosInstance.js";
import { toast } from 'sonner';
import { profile } from '../../assets/index.js';

function UpdateProfilePictureModal() {
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);
    const [fileId, setFileId] = useState(profile);
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const cropperRef = useRef(null);

    // Handle file drop
    const onDrop = (acceptedFiles) => {
        if (!acceptedFiles || acceptedFiles.length === 0) {
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
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] } 
    });

    // Close the modal and reset the states
    const handleCloseModal = () => {
        setImage(null);
        setFile(null);
        setCroppedImage(null);
        setShowModal(false);
    };

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas({ width: 500, height: 500, fillColor: '#fff' });
            setCroppedImage(croppedCanvas.toDataURL());
        }
    };

    const handleRecrop = () => setCroppedImage(null);
   
    const handleSaveProfile = async () => {
        if (croppedImage) {
            try {
                const response = await axios.post("/file/upload", {
                    base64Image: croppedImage, 
                });
                setFileId(response.data.data.id); 
                toast.success(response.data.message);
            } catch (error) {
                return toast.error(error.response?.data?.message || "Upload failed");
            }
        }
    
        if (fileId) {
            try {
                const response = await axios.post("/user/add-profilePic", { profilePic: fileId });
                console.log(response.data.message);
                toast.success(response.data.message);
            } catch (error) {
                toast.error(error.response?.data?.message || "Update failed");
            }
        } else {
            toast.error("No file uploaded");
        }
    
        handleCloseModal();
    };

    return (
        <div>
            <div className='space-x-4'>
                <Button variant='error'>Remove</Button>
                <Button variant='info' onClick={() => setShowModal(true)}>Add Profile Picture</Button>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                    {/* Modal with updated size */}
                    <div className="relative bg-white rounded-lg p-8 w-[50rem] h-[35rem] max-w-full space-y-4 flex flex-col justify-between">
                        {/* Close Button */}
                        <button 
                            onClick={handleCloseModal} 
                            className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                        >
                            <RiCloseLargeFill className="w-4 h-4 transition-colors duration-200" />
                        </button>

                        <p className="text-2xl font-bold m-0">Update Profile Picture</p>

                        {/* Drag and Drop or Cropper Area */}
                        <div className="flex flex-col items-center justify-center flex-grow">
                            {/* Drag-and-Drop Section (hidden during cropping) */}
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

                            {/* Cropper Section */}
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

                            {/* Cropped Image Preview */}
                            {croppedImage && (
                                <div className="flex flex-col items-center justify-center m-0">
                                    <div className="w-[300px] h-[300px] rounded-full overflow-hidden bg-gray-200">
                                        <img src={croppedImage} alt="Cropped" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4">
                            {/* Close the modal */}
                            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>

                            {/* Crop button, visible only if image is uploaded */}
                            {!croppedImage && image && <Button variant='info' onClick={handleCrop}>Next</Button>}

                            {/* Recrop button, visible only if an image is cropped */}
                            {croppedImage && <Button onClick={handleRecrop}>Recrop</Button>}

                            {/* Update Profile Pic */}
                            {croppedImage && <Button variant='info' onClick={handleSaveProfile}>Save Profile</Button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateProfilePictureModal;
