import React, { useState } from 'react';
import { HiOutlinePhotograph } from "react-icons/hi";
import Button from '../../component/button/Button.jsx';

const ImageUploader = ({ onUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [formError, setFormError] = useState({ file: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({ file, preview: imageUrl });
      onUpload(file); 
    } else {
      setFormError({ file: "Only .png, .jpg, or .jpeg files are allowed" });
    }
  };

  return (
    <div className="m-0 p-0">
      {/* Image Upload Placeholder */}
      <div className="relative flex items-center justify-center w-auto lg:h-[50rem] sm:h-[25rem] rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all">
        {selectedImage ? (
          <img
            src={selectedImage.preview}
            alt="Selected"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <HiOutlinePhotograph className="w-24 h-24 text-gray-600" />
        )}
        <input
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />
      </div>
      {formError.file && <p className="text-red-500 mt-2">{formError.file}</p>}
    </div>
  );
};

export default ImageUploader;
