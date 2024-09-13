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

  const params = useParams()
  const postId = params.id

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [categories, setCategories] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [loading, setLoading] = useState(false);

  const socket = useSocket()
  const navigate = useNavigate();

  useEffect(() => {
    if(postId){
      const getPost = async() => {
      try{

        //api request
        const response = await axios.get(`/posts/${postId}`)
        const data = response.data.data
        console.log(data)
        toast.success("Post get successfull")

        setFormData({
            title : data.post.title, 
            description : data.post.description,
            file : data.post?.file?._id,
            category : data.post.category._id
        })
      }catch(error){
        const response = error.response
        const data = response.data
        toast.error(data.message);
      }
      }
      getPost()
    }
  }, [postId])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/category');
        const data = response.data;
        toast.success(data.message);
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
  }, [])

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
      setFormError((prev) => ({ ...prev, file: "Only .png or .jpg or .jpeg file allowed" }));
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
      setFormError("need things");
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
        toast.error("couldnt update");
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <section className="bg-white">
      <div className="py-4 mx-auto lg:flex-row md:flex-col sm:flex-col lg:flex gap-8">
        
        {/* Form Section */}
        <div className="lg:w-1/2 md:w-full sm:w-full ">
          <BackButton />
          <h4 className="h4 mb-4 font-bold text-slate-800">Update Post</h4>
          <form id='new-post' onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="label">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="input-box mt-2"
                  placeholder="Type title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
                {formError.title && <p className="validateError">{formError.title}</p>}
              </div>

              <div className="sm:col-span-2 flex items-center gap-4">
                <div className="w-full">
                  <label htmlFor="file" className="label">Upload File</label>
                  <Button className="relative flex overflow-hidden mt-2">
                    <input
                      type="file"
                      name="file"
                      id="file"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    Upload File
                  </Button>
                  {formError.file && <p className="validateError">{formError.file}</p>}
                </div>

                <div className="w-full">
                  <label htmlFor="category" className="label">Select a category</label>
                  <select
                    id="category"
                    className="mt-2 block w-full px-4 py-2 text-sm text-gray-900 rounded-lg border-2 border-color-s"
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
                  {formError.category && <p className="validateError">{formError.category}</p>}
                </div>
              </div>
              <DescriptionEditor formData={formData} handleChange={handleDescriptionChange} />
            </div>

            <Button variant="info" className="mt-5">
              Update post
            </Button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="py-14 lg:w-1/2 md:w-full sm:w-full">
          <h4 className="h4 mb-10 font-bold text-slate-800">Preview</h4>
          <div className="border-2 border-color-s rounded-lg">
            <h4 className="h4 mb-4 font-bold pt-4 px-4 text-slate-800">{formData.title}</h4>
            <ReactQuill
            className='p-0'
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
