import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../../utils/axiosInstance.js';
import Button from '../../component/button/Button.jsx';
import moment from 'moment';

const CategoryList = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
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
        toast.error(data.message);
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

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      toast.error(data.message);
    }
  };

  const handleDelete = async () => {
    try{

      const response = await axios.delete(`/category/${categoryId}`)
      const data = response.data
      toast.success(data.message)

      const response2 = await axios.get(`/category?page=${currentPage}&q=${searchValue}`)
      const data2 = response2.data.data
      setCategories(data2.categories)
      setTotalPage(data2.pages)
      setShowModal(false)

    }catch(error){
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
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
    <div className="">
      <div>
        <h2 className='h5 font-bold'>Categories</h2>
      </div>
      <div className='flex justify-between items-center mt-5'>
        <div className=''>
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
                className="block  ps-10 text-sm border border-gray-300 opacity-80 hover:opacity-100 focus:opacity-100 rounded-full outline-none px-5 py-2 transition-opacity duration-200 ease-in-out" 
                placeholder="Search categories" 
                onChange={handleSearch}
                required 
              />
            </div>
          </form>
        </div>
        <div>
          <Button variant='info' className='w-full' onClick={() => { navigate("new-category") }}>Add new category</Button>
        </div>
      </div>

      {loading ? "Loading" : (
        <div className="overflow-x-auto mt-5">
          <table className="table-auto w-full border-collapse border border-slate-400 lg:text-sm sm:text-xs">
            <thead className="sticky top-0 bg-gray-100 z-10">
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
                <tr key={category._id} className="border border-slate-300 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
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
      {pageCount.length > 0 && (
        <nav className='flex items-center justify-center pb-10 mt-5' aria-label="Page navigation example">
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <button className="pageButton rounded-l-lg rounded-r-none" onClick={handlePrev} disabled={currentPage === 1}>previous</button>
            </li>
            {pageCount.map((pageNumber, index) => (
              <li key={index}>
                <button className={`pageButton rounded-none ${currentPage === pageNumber ? `bg-gray-100 active:bg-gray-200` : ""}`} onClick={() => handlePage(pageNumber)}>{pageNumber}</button>
              </li>
            ))}
            <li>
              <button className="pageButton rounded-r-lg rounded-l-none" onClick={handleNext} disabled={currentPage === totalPage}>next</button>
            </li>
          </ul>
        </nav>
      )}
      {showModal && (
        <div
          id="popup-modal"
          tabIndex="-1"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-brightness-50"
        >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              data-modal-hide="popup-modal"
              onClick={closeModal}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <h3 className="mb-5 mt-10 font-normal text-gray-500 text-md">
                Are you sure you want to delete this product?
              </h3>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                onClick={handleDelete}
              >
                Yes, I'm sure
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                onClick={closeModal}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
      
    </div>

    
  );
};

export default CategoryList;