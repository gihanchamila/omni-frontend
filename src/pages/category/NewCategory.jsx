import { useState } from "react";
import axios from '../../utils/axiosInstance.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import Button from '../../component/button/Button.jsx';
import BackButton from "../../component/button/BackButton.jsx";

import addCategoryValidator from "../../validators/addCategoryValidator.js";

const initialFormData = { title: "", description: "" };
const initialFormError = { title: "" };

const NewCategory = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = addCategoryValidator({ title: formData.title });
    if (errors.title) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        const response = await axios.post('/category', formData);
        const data = response.data;
        toast.success(data.message);

        setFormData(initialFormData);
        setFormError(initialFormError);
        navigate('/categories')
      } catch (error) {
        setFormError(initialFormError);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="bg-white">
      <div className="py-12 px-12 mx-auto max-w-2xl lg:py-16">
        <BackButton/> 
        <h4 className="h4 mb-4 font-bold text-slate-800">Add a new category</h4>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="label">
                Category Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="input-box mt-2"
                placeholder="Type category name"
                required
                value={formData.title}
                onChange={handleChange}
              />
              {formError.title && <p className="validateError">{formError.title}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="8"
                className="input-box mt-2"
                placeholder="Your description here"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <Button variant="info" className="mt-5" loading={true}>
            Add Category
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewCategory;