import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import axios from '../../utils/axiosInstance.js'

import Button from '../../component/button/Button.jsx'

const CategoryList = () => {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [totalPage, setTotalPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [categoryId, setCategoryId] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const getCategories = async () => {

      try{
        setLoading(true)
        const response = await axios.get('/category')
        const data = response.data.data

        setCategories(data.categories)
        setTotalPage(data.pages)
        setLoading(false)

      }catch(error){
        setLoading(false)
        const response = error.response;
        const data = response.data;
        toast.error(data.message)
      }
    }

    getCategories()
  }, [currentPage])

  return (

    <div>
      <div>
        <h2 className='h5 font-bold'>Categories</h2>
      </div>
      <div className='flex justify-between items-center mt-5'>
        <div>
            <form className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg 
                    className="w-4 h-4 text-gray-500 dark:text-gray-400" 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      stroke="currentColor" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input 
                  type="search" 
                  id="default-search" 
                  className="block w-full ps-10 text-sm border-2 border-color-s opacity-50 hover:opacity-70 focus:opacity-75 rounded-lg outline-none px-5 py-2" 
                  placeholder="Search categories" 
                  required 
                />
              </div>
            </form>
          </div>
          <div>
           <Button primary={true} className="justify-self-end">Add new category</Button>
          </div>
      </div>
      {loading ? "Loading" : (
            <table className="table-auto w-full mt-10 border-collapse  border border-slate-400">
            <thead className='text-left'>
              <tr className='mb-5'>
                <th className='border border-slate-300 ...'>Title</th>
                <th className='border border-slate-300 ...'>Description</th>
                <th className='border border-slate-300 ...'>Created At</th>
                <th className='border border-slate-300 ...'>Updated At</th>
                <th className='border border-slate-300 ...'>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border border-slate-300 ...'>
                <td className='border border-slate-300 ...'>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                <td className='border border-slate-300 ...'>Malcolm Lockyer</td>
                <td className='border border-slate-300 ...'>1961</td>
              </tr>
              <tr>
                <td className='border border-slate-300 ...'>Witchy Woman</td>
                <td className='border border-slate-300 ...'>The Eagles</td>
                <td className='border border-slate-300 ...'>1972</td>
              </tr>
              <tr>
                <td className='border border-slate-300 ...'>Shining Star</td>
                <td className='border border-slate-300 ...'>Earth, Wind, and Fire</td>
                <td className='border border-slate-300 ...'>1975</td>
              </tr>
            </tbody>
          </table>
          )}
    </div>
  )
}

export default CategoryList