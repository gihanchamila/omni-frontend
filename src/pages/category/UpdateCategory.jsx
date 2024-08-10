import { useEffect, useState } from "react";
import axios from '../../utils/axiosInstance.js';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const initialFormData = {title: "", description: ""}
const initialFormError = {title: ""}

const UpdateCategory = () => {

    const [formData, setFormData] = useState(initialFormData)
    const [formError, setFormError] = useState(initialFormError)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const categoryId = params.id

    useEffect(() => {
        if(categoryId){
            const getCategory = async () => {
                try{
                    const response = await axios.get(`/category/${categoryId}`, formData)
                    const data = response.data.data

                    setFormData({
                        title: data.category.title,
                        description: data.category.description
                    })
                }catch(error){
                    const response = error.response
                    const data = response.data
                    toast.error(data.message)
                }
            }
            getCategory()
        }

    }, [categoryId])

    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name] : e.target.name}))
    }

    
    

  return (
    <div>

    </div>
  )
}

export default UpdateCategory