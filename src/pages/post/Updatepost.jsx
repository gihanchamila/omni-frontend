import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../component/context/useSocket.jsx';
import axios from '../../utils/axiosInstance.js';
import { toast } from 'sonner';


// Custom Components
import Button from '../../component/button/Button.jsx';
import BackButton from '../../component/button/BackButton.jsx';
import DescriptionEditor from '../../component/quill/DescriptionEditor.jsx';
import ImageUploader from './ImageUploader.jsx';

// Validators
import addPostValidator from '../../validators/addPostValidator.js';

// Third-Party Libraries
import ReactQuill from 'react-quill';

const initialFormData = { title: "", description: "", category: "", file: null };
const initialFormError = { title: "", description: "", category: "", file: "" };

const UpdatePost = () => {
  const params = useParams();
  const postId = params.id;

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [categories, setCategories] = useState([]);
  const [fileKey, setFileKey] = useState("")
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState();
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`/posts/${postId}`);
        const postData = response.data?.data?.post;
  
        if (postData) {
          setFileKey(postData.file?.key || ""); 
          setFormData({
            title: postData.title || "",
            description: postData.description || "",
            file: postData.file?._id || null,
            category: postData.category?._id || "",
          });
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred while fetching post data";
        // toast.error(errorMessage); // Display the error message
      }
    };

    const getExisitingFile = async () => {
      if (fileKey) {  
          try {
              const response = await axios.get(`/file/signed-url?key=${fileKey}`);
              const data = response.data.data;
              setFile(response.data.data.url)
              // toast.success(data.message);
          } catch (error) {
              const response = error.response;
              const data = response.data;
              // toast.error(data.message || "Failed to fetch existing file");
          }
      }
    };

    getExisitingFile()
    getPost();
  }, [postId, fileKey, file]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/category');
        setCategories(response.data.data.categories);
      } catch (error) {
        // toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    socket.on('postUpdated', (updatedPost) => {
      // toast.success(`Post Updated: ${updatedPost.title}`);
    });

    return () => {
      socket.off('postUpdated');
    };
  }, [socket]);

  const handleImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const errors = addPostValidator({
      title: formData.title,
      category: formData.category,
    });

    if (errors.title || errors.category || (step === 1 && !formData.file)) {
      setFormError(errors);
    } else {
      setFormError(initialFormError);
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        setLoading(true);
          const input = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            file: formData.file
        };
  
         if (formData.file instanceof File) {
          const imageFormData = new FormData();
          imageFormData.append("image", formData.file);
          const fileResponse = await axios.post("/file/upload", imageFormData);
          input.file = fileResponse.data.data.id;
          // toast.success(fileResponse.data.message);
        } 

        const response = await axios.put(`/posts/${postId}`, input);
        // toast.success(response.data.message);
        setFormData(initialFormData);
        setFormError(initialFormError);
        navigate('/');
      } catch (error) {
        console.error("Error updating post:", error);
        const errorMessage = error.response?.data?.message || "Couldn't update post";
        // toast.error(errorMessage);
      }
    
  };
  
  const getTitle = () => {
    switch (step) {
      case 1: return 'Step 1: Update Title and Image';
      case 2: return 'Step 2: Update  Description and Category';
      case 3: return 'Step 3: Preview Your updated Post';
      default: return 'Update Post';
    }
  };

  return (
    <section className="lg:bg-gray-50 flex items-center justify-center py-12 rounded-xl">
      <div className="lg:bg-white rounded-lg lg:w-3/4 sm:w-full lg:p-10 sm:p-0">
        
        {/* Form Section */}
        <div className="bg-white rounded-lg ">
          <BackButton />
          <h4 className="step">{getTitle()}</h4>
          {loading && <div className="text-center">Loading...</div>}

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter title"
                  required
                  value={formData.title || ""}
                  onChange={handleChange}
                />
                {formError.title && <p className="text-sm text-red-600 mt-2">{formError.title}</p>}
              </div>

              <div className='space-y-4'>
                <h3 className="label">Upload an image (if no existing image is found, it will be saved).</h3>
                {formData.image && (
                  <div className="mb-4">
                    <ImageUploader file={file} />
                  </div>
                )}
                <ImageUploader onUpload={handleImageUpload} />
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
              <DescriptionEditor 
                formData={formData} 
                handleChange={handleChange} 
              />
              {formError.description && <p className="text-red-500 text-sm mt-2">{formError.description}</p>}

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Select Category</label>
                <select
                  id="category"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                {(formData.file instanceof File) ? (
                    <img 
                      src={URL.createObjectURL(formData.file)} 
                      alt="Uploaded" 
                      className="w-full lg:h-[50rem] sm:h-[15rem] object-cover mb-2 rounded-lg" 
                    />
                  ) : formData.file ? (
                    <img 
                      src={file} 
                      alt="Existing" 
                      className="w-full lg:h-[50rem] sm:h-[25rem]  object-cover mb-2 rounded-lg" 
                    />
                  ) : null}
                <ReactQuill className='p-0 m-0' value={formData.description} readOnly={true} theme="bubble" />
              </div>

              <div className="flex justify-end">
              <Button variant="outline" className="mt-4 mr-4" onClick={() => setStep(2)}>Back</Button>
              <Button variant="info" className="mt-4 px-4 py-2 text-sm bg-blue-500 text-white font-medium rounded-lg"  onClick={handleSubmit}>
                Update Post
              </Button>
            </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpdatePost;
