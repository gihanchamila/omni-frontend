import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
import axios from '../../utils/axiosInstance.js';
import moment from 'moment';
import { motion } from 'framer-motion';

// Custom Components
import Button from '../../component/button/Button.jsx';
import Modal from '../../component/modal/Modal.jsx';
import Pagination from '../../component/pagination/Pagination.jsx';
import SearchBar from '../../component/search/SearchBar.jsx';

const CategoryList = () => {
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  const [sortField, setSortField] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/category?page=${currentPage}&q=${searchValue}&sortField=${sortField}&sortOrder=${sortOrder}`);
        const data = response.data.data;
        setCategories(data.categories);
        setTotalPage(data.pages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        const response = error.response;
        const data = response.data;
        // toast.error(data.message);
      }
    };

    getCategories();
  }, [currentPage, searchValue, sortField, sortOrder]);

  useEffect(() => {
    if (totalPage > 1) {
      let tempPageCount = [];
      for (let i = 1; i <= totalPage; i++) {
        tempPageCount = [...tempPageCount, i];
      }
      setPageCount(tempPageCount);
    } else {
      setPageCount([]);
    }
  }, [totalPage]);

  const handleSearch = async (e) => {
    try {
      const input = e.target.value;
      setSearchValue(input);
      const response = await axios.get(`/category?q=${input}&page=${currentPage}&sortField=${sortField}&sortOrder=${sortOrder}`);
      const data = response.data.data;
      setCategories(data.categories);
      setTotalPage(data.pages);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      // toast.error(data.message);
    }
  };

  const handleDelete = async () => {
    try{

      const response = await axios.delete(`/category/${categoryId}`)
      const data = response.data
      // toast.success(data.message)

      const response2 = await axios.get(`/category?page=${currentPage}&q=${searchValue}`)
      const data2 = response2.data.data
      setCategories(data2.categories)
      setTotalPage(data2.pages)
      setShowModal(false)

    }catch(error){
      const response = error.response;
      const data = response.data;
      // toast.error(data.message);
    }
  }

  const openModal = (id) => {
    setCategoryId(id)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <motion.div 
      className=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className='title'>Categories</h2>
      </div>
      <div className='flex justify-between items-center'>
        <div className='block'>
          <SearchBar placeholder={'Find Category'} handleSearch={handleSearch}/>
        </div>
        <div>
          <Button variant='info' className='w-full' onClick={() => { navigate("new-category") }}>Add new category</Button>
        </div>
      </div>

      {loading ? "Loading" : (
        <div className="overflow-x-auto mt-5">
          <table className="table-auto w-full border-collapse border border-slate-400 lg:text-sm sm:text-xs">
            <thead className="sticky top-0 bg-gray-100  z-10">
              <tr className="mb-5">
                <th className="border text-left border-slate-300 px-2 lg:px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors duration-150 ease-in-out" onClick={() => handleSort("title")}>
                  Title 
                  <span className="">
                    {sortField === "title" && (sortOrder === "asc" ? "" : "")}
                  </span>
                </th>
                <th className="border text-left border-slate-300 px-2 lg:px-4 py-2 hover:bg-gray-200">Description</th>
                <th className="border text-left border-slate-300 px-2 lg:px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors duration-150 ease-in-out" onClick={() => handleSort("createdAt")}>
                  Created At 
                  <span className="">
                    {sortField === "createdAt" && (sortOrder === "asc" ? "" : "")}
                  </span>
                </th>
                <th className="border text-left border-slate-300 px-2 lg:px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors duration-150 ease-in-out" onClick={() => handleSort("updatedAt")}>
                  Updated At 
                  <span className="">
                    {sortField === "updatedAt" && (sortOrder === "asc" ? "" : "")}
                  </span>
                </th>
                <th className="border border-slate-300 px-2 lg:px-4 py-2 text-center hover:bg-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border border-slate-300 sm:hover:bg-gray-50 dark:hover:bg-slate-700 even:bg-slate-800transition-colors duration-150 ease-in-out">
                  <td className="border border-slate-300 px-2 lg:px-4 py-2">{category.title}</td>
                  <td className="border border-slate-300 px-2 lg:px-4 py-2">{category.description}</td>
                  <td className="border border-slate-300 px-2 lg:px-4 py-2">{moment(category.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                  <td className="border border-slate-300 px-2 lg:px-4 py-2">{moment(category.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                  <td className="border border-slate-300 px-2 lg:px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button variant='info' className="lg:px-2 lg:py-1 sm:text-xs sm:px-1 sm:py-1 rounded-md" onClick={() => navigate(`update-category/${category._id}`)} >Update</Button>
                      <Button variant='error' className="lg:px-2 lg:py-1 sm:text-xs rounded-md sm:px-1 sm:py-1" data-modal-target="popup-modal" data-modal-toggle="popup-modal" onClick={() => {openModal(category._id)}} >Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination currentPage={currentPage} totalPage={totalPage} pageCount={pageCount} onPageChange={setCurrentPage}/>
      <Modal  className='z-auto' showModal={showModal} title="Are you sure you want to delete this category?" onConfirm={(handleDelete)} onCancel={closeModal}/>
    </motion.div>
  );
};

export default CategoryList;