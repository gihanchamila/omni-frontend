import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance.js';
import { toast } from 'sonner';
import Button from '../../component/button/Button.jsx';
import ImageUploader from './ImageUploader.jsx';
import DescriptionEditor from '../../component/quill/DescriptionEditor.jsx';
import addPostValidator from '../../validators/addPostValidator.js';
import BackButton from '../../component/button/BackButton.jsx';
import ReactQuill from 'react-quill';
import { useSocket } from '../../component/context/useSocket.jsx';
import { useNotification } from '../../component/context/useNotification.jsx';

const initialFormData = { title: "", description: "", file: null, category: "" };
const initialFormError = { title: "", description: "", category: "" };

const NewPost = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const socket = useSocket();
  const {setNotifications } = useNotification();
  const hasListeners = useRef(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/category');
        setCategories(response.data.data.categories);
        toast.success(response.data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
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
    setLoading(true);
    try {
      const formInput = { ...formData };

      if (formData.file) {
        const imageFormData = new FormData();
        imageFormData.append("image", formData.file);

        const fileResponse = await axios.post("/file/upload", imageFormData);
        formInput.file = fileResponse.data.data.id;
        toast.success(fileResponse.data.message);
      }

      const response = await axios.post('/posts', formInput);
      const notificationId = response.data.data.notificationId;
      toast.success(response.data.message);

      if (socket) {
        socket.emit("postAddedNotification", {notificationId});
      }
      setFormData(initialFormData);
      setFormError(initialFormError);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Unexpected Error");
    } finally {
      setLoading(false);
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

  return (
    <div className="lg:bg-gray-50 flex items-center justify-center py-12 rounded-xl w-full">
      <div className="lg:bg-white rounded-lg lg:w-3/4 sm:w-full lg:p-10">
        <BackButton />
        <p className="step">{getTitle()}</p>
          <>
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-6">
                <div className='space-y-2'>
                  <label htmlFor="title" className="label">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  <Button variant="primary" type="submit" className="mt-4 px-4 py-1 text-sm bg-blue-500 text-white font-medium rounded-lg">
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
                    className="mt-2 block w-full px-4 py-3 text-gray-900 rounded-lg border border-gray-200"
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
                  <Button variant="primary" type="submit" className="mt-4 px-4 py-1 text-sm bg-blue-500 text-white font-medium rounded-lg">
                    Next Step
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg space-y-4">
                  <h4 className="h4 font-bold w-full">{formData.title}</h4>
                  {formData.file && (
                    <img src={URL.createObjectURL(formData.file)} alt="Uploaded" className="w-full h-[50rem] object-cover mb-2 rounded-lg" />
                  )}
                  <ReactQuill className='p-0 m-0' value={formData.description} readOnly={true} theme="bubble" />
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
      </div>
    </div>
  );
};

export default NewPost;
