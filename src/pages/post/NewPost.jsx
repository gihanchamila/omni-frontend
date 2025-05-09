import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance.js';
import { toastError, toastSuccess } from '../../utils/toastMessages.js';
import Button from '../../component/button/Button.jsx';
import ImageUploader from './ImageUploader.jsx';
import DescriptionEditor from '../../component/quill/DescriptionEditor.jsx';
import addPostValidator from '../../validators/addPostValidator.js';
import BackButton from '../../component/button/BackButton.jsx';
import ReactQuill from 'react-quill';
import { useSocket } from '../../component/context/useSocket.jsx';
import { useNotification } from '../../component/context/useNotification.jsx';
import { motion } from 'framer-motion';

const initialFormData = { title: "", description: "", file: null, category: "" };
const initialFormError = { title: "", description: "", category: "" };

const NewPost = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate();
  const socket = useSocket();
  const {setNotifications } = useNotification();
  const hasListeners = useRef(false);
  const inputRef = useRef(null)
  const topRef = useRef(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/category');
        setCategories(response.data.data.categories);
        setLoading(false)
        // toastSuccess(response)
      } catch (error) {
        setLoading(false);
        toastError(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if(!hasListeners.current){
      const handlePostAdded = (data) => { 
        setNotifications(prev => [...prev, {
          type: "post",
          message: `Post added successfully`,
          isRead: false,
          _id : data.notificationId
        }]);
      }

      if (!hasListeners.current) {
        socket.on('postAddedNotification', handlePostAdded)
        hasListeners.current = true;
      }
  
      return () => {
        socket.off('postAddedNotification', handlePostAdded)
      }
    }
  }, [socket, setNotifications])

  useEffect(() => {
    if(inputRef.current){
      inputRef.current.focus()
    }
  }, [])

  const handleImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();

    const errors = addPostValidator(
      { title: formData.title, description: formData.description, category: formData.category },
      step
    );

    if (Object.values(errors).some((error) => error) || (step === 1 && !formData.file)) {
      setFormError(errors);
    } else {
      setFormError(initialFormError);
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formInput = { ...formData };

      if (formData.file) {
        
        const imageFormData = new FormData();
        imageFormData.append("image", formData.file);
        const fileResponse = await axios.post("/file/upload", imageFormData);
        formInput.file = fileResponse.data.data.id;
        toastSuccess(fileResponse)
        
      }
      const response = await axios.post('/posts', formInput);
      const notificationId = response.data.data.notificationId;
      toastSuccess(response)

      if (socket) {
        socket.emit("postAddedNotification", {notificationId});
      }
      setFormData(initialFormData);
      setFormError(initialFormError);
      setLoading(false)
      navigate('/');
    } catch (error) {
      setLoading(false)
      toastError(error)
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1: return 'Step 1: Add Title and Image';
      case 2: return 'Step 2: Add Description and Category';
      case 3: return 'Step 3: Preview Your Post';
      default: return 'Create a New Post';
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    } else if (step === 2) {
      setStep(1);
    } else {
      setStep(2);
    }
  };
  

  return (
    <div className="lg:bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 rounded-xl w-full">
      <motion.div 
        className="lg:bg-white  sm:bg-slate-900 rounded-lg lg:w-3/4 xs:w-full lg:p-10 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton className={'xs:mb-5'} onClick={handleBack} />
        <motion.div className="step">
          <motion.div
            ref={topRef}
            className="absolute top-0 left-0 h-full bg-blue-100 rounded-lg"
            style={{ width: `${(step / 3) * 100}%` }} 
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            tabIndex="0"
            autoFocus
          />
          <motion.p className="relative z-10 text-blue-500 font-bold">
            {getTitle()}
          </motion.p>
        </motion.div>
          <>
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-6">
                <div className='space-y-2'>
                  <label htmlFor="title" className="label">Title</label>
                  <input
                    ref={inputRef}
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="postInput"
                    placeholder="Enter the title of your post"
                    required
                  />
                  {formError.title && <p className="text-red-500 text-sm mt-2">{formError.title}</p>}
                </div>

                <div className='space-y-4'>
                  <h3 className="label">Upload an Image</h3>
                  <ImageUploader onUpload={handleImageUpload} file={formData.file} />

                  {formError.file && <p className="text-red-500 text-sm mt-2">{formError.file}</p>}
                </div>

                <div className="flex justify-end">
                  <Button variant="info" type="submit" className="mt-4 px-4 py-1 text-sm bg-blue-500 text-white font-medium rounded-lg">
                    Next Step
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-6">
                <div>
                  <DescriptionEditor formData={formData} handleChange={handleChange} />
                  {formError.description && <p className="text-red-500 text-sm mt-2">{formError.description}</p>}
                </div>

                <div className="w-full mt-4">
                  <label htmlFor="category" className="label">Select a category</label>
                  <select
                    id="category"
                    className="mt-2 postInput"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                  {formError.category && <p className="text-red-500 text-sm mt-2">{formError.category}</p>}
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="mt-4 mr-4" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="info" type="submit" className="mt-4 px-4 py-1 text-sm bg-blue-500 text-white font-medium rounded-lg">
                    Next Step
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg space-y-4 ">
                  <h4 className="h4 font-bold w-full dark:xs:text-white dark:lg:text-slate-700 dark:xs:text-lg dark:sm:text-2xl">{formData.title}</h4>
                  {formData.file && (
                    <img src={URL.createObjectURL(formData.file)} alt="Uploaded" className="w-full lg:h-[50rem] sm:h-[25rem] object-cover mb-2 rounded-lg" />
                  )}
                  <ReactQuill className='p-0 m-0 dark:sm:text-white dark:sm:bg-slate-900 dark:sm:rounded-lg dark:lg:text-slate-700' value={formData.description} readOnly={true} theme="bubble" />
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="mt-4 mr-4" onClick={() => setStep(2)}>Back</Button>
                  <Button variant="info" className="mt-4 px-4 py-2 text-sm bg-blue-500 text-white font-medium rounded-lg" onClick={handleSubmit}>
                    {loading ? "Adding post..." : "Add Post"}
                  </Button>
                </div>
              </div>
            )}
          </>
      </motion.div>
    </div>
  );
};

export default NewPost;
