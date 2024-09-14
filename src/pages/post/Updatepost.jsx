import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket.jsx';
import axios from '../../utils/axiosInstance.js';
import { toast } from 'sonner';

// Custom Components
import Button from '../../component/button/Button.jsx';
import BackButton from '../../component/button/BackButton.jsx';
import DescriptionEditor from '../../component/quill/DescriptionEditor.jsx';

// Validators
import addPostValidator from '../../validators/addPostValidator.js';

// Third-Party Libraries
import ReactQuill from 'react-quill';

const initialFormData = { title: "", description: "", category: "", file: "" };
const initialFormError = { title: "", description: "", category: "", file: "" };

const UpdatePost = () => {

  const params = useParams();
  const postId = params.id;

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [categories, setCategories] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [loading, setLoading] = useState(false);

  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (postId) {
      const getPost = async () => {
        try {
          const response = await axios.get(`/posts/${postId}`);
          const data = response.data.data;
          setFormData({
            title: data.post.title,
            description: data.post.description,
            file: data.post?.file?._id,
            category: data.post.category._id,
          });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
      getPost();
    }
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/category');
        setCategories(response.data.data.categories);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    socket.on('postUpdated', (updatedPost) => {
      toast.success(`Post Updated: ${updatedPost.title}`);
    });

    return () => {
      socket.off('postUpdated');
    };
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      const formInput = new FormData();
      formInput.append("image", file);
      try {
        setLoading(true);
        const response = await axios.post("/file/upload", formInput);
        setFileId(response.data.data.id);
        toast.success(response.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    } else {
      setFormError((prev) => ({ ...prev, file: "Only .png, .jpg, or .jpeg files allowed" }));
    }
  };

  const handleDescriptionChange = (e) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = addPostValidator({
      title: formData.title,
      category: formData.category,
    });

    if (errors.title || errors.category) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        let input = formData;
        if (fileId) {
          input = { ...input, file: fileId };
        }

        const response = await axios.put(`/posts/${postId}`, input);
        toast.success(response.data.message);
        setFormData(initialFormData);
        setFormError(initialFormError);
        navigate('/posts');
      } catch (error) {
        toast.error("Couldn't update post");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="bg-white p-8">
      <div className="container mx-auto lg:flex lg:space-x-8">
        
        {/* Form Section */}
        <div className="lg:w-1/2">
          <BackButton />
          <h4 className="text-2xl font-bold text-gray-800 mb-6">Update Post</h4>
          <form id='new-post' onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-2 w-full px-4 py-2  shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter title"
                required
                value={formData.title}
                onChange={handleChange}
              />
              {formError.title && <p className="text-sm text-red-600 mt-2">{formError.title}</p>}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload File</label>
                <Button className="mt-2 relative flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  Upload File
                </Button>
                {formError.file && <p className="text-sm text-red-600 mt-2">{formError.file}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Select Category</label>
                <select
                  id="category"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                {formError.category && <p className="text-sm text-red-600 mt-2">{formError.category}</p>}
              </div>
            </div>

            <DescriptionEditor formData={formData} handleChange={handleDescriptionChange} />

            <Button type="submit" className="mt-6 w-full py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700">
              Update Post
            </Button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:w-1/2 lg:py-0 py-10">
          <h4 className="text-2xl font-bold text-gray-800 mb-6 mt-14">Preview</h4>
          <div className="border border-gray-300 rounded-lg">
            <h4 className="text-xl font-semibold text-gray-800  px-4 py-4">{formData.title}</h4>
            <ReactQuill
              className=''
              value={formData.description}
              readOnly={true}
              theme="bubble"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdatePost;
