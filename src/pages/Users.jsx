import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance.js'
import Pagination from '../component/pagination/Pagination.jsx';
import Button from '../component/button/Button.jsx';
import Modal from '../component/modal/Modal.jsx';
import moment from 'moment';
import SearchBar from '../component/search/SearchBar.jsx';
import { useSocket } from '../component/context/useSocket.jsx';
import { motion } from 'framer-motion';
import { toastError, toastSuccess } from '../utils/toastMessages.js';

const Users = () => {

  const socket = useSocket();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/user/all-users', {
          params: {
            page: currentPage,
            size: 10,
            sortField,
            sortOrder,
          },
        });
        const data = response.data;
        toastSuccess(data);
        setAllUsers(data.users); // Store all users
        setUsers(data.users);    // Show all users initially
        setTotalPage(data.pages || 1);
      } catch (error) {
        toastError(error);
      } finally {
        setLoading(false);
      }
  };

  fetchUsers();
  }, [currentPage, sortField, sortOrder]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setUsers(allUsers); // Always reset to all users
    } else {
      const filtered = allUsers.filter(user =>
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  const handleSearch = (e) => {
    // If called from a form submit, prevent default
    if (e && e.preventDefault) e.preventDefault();
    // If called from input change, get value
    const value = e.target ? e.target.value : e;
    setSearchQuery(value);
    setCurrentPage(1);
  };

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

  useEffect(() => {
    if (socket) {
      socket.on('User-deleted', (data) => {
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== data.id));
      });
    }
    return () => {
      if (socket) {
        socket.off('User-deleted');
      }
    };
  }, [socket]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/user/delete-single-user/${id}`);
      const data = response.data;
      toastSuccess(data);
      setShowModal(false);
      if(socket){
        socket.emit('User-deleted', {id})
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== id));
      }else{
        console.error('Socket is undefined');
      }
    } catch (error) {
      toastError(error);
    }
  };

  const openModal = (id) => {
    setUserId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSort = (field) => {
    const order = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    >
    <div>
      <div>
        <h2 className='title'>Users</h2>
      </div>
      <div className='flex justify-between'>
      <div className='flex  justify-start items-start'>
        <SearchBar placeholder={"Find user"} handleSearch={handleSearch}/>
      </div>
      <div>
        <p className='hidden'>hi</p>
      </div>
    </div>
    </div>
    
      {loading ? (
        "Loading..."
      ) : (
        <div className="overflow-x-auto mt-5">
          <table className="table-auto w-full border-collapse border border-slate-400 rounded-lg lg:text-sm sm:text-xs">
            <thead className="sticky top-0 bg-gray-100 z-10 rounded-lg">
              <tr>
                {/* <th
                  className="border text-left border-slate-300 px-2 lg:px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('firstName')}
                >
                  Id
                </th> */}

                <th
                  className="tableTh"
                  onClick={() => handleSort('firstName')}
                >
                  Full name
                </th>

                <th
                  className="tableTh"
                  onClick={() => handleSort('email')}
                >
                  Email
                </th>

                <th
                  className="tableTh"
                  onClick={() => handleSort('gender')}
                >
                  Gender
                </th>

                <th
                  className="tableTh"
                  onClick={() => handleSort('firstName')}
                >
                  Verification
                </th>
                
                <th
                  className="tableTh"
                  onClick={() => handleSort('createdAt')}
                >
                  Created At
                </th>
                <th className="tableTh">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border border-slate-300 sm:hover:bg-gray-50 dark:hover:bg-slate-700 even:bg-slate-800">
                    {/* <td className="border border-slate-300 px-2 lg:px-4 py-2">{user._id}</td> */}
                    <td className="tableTd">{user.firstName} {user.lastName}</td>
                    <td className="tableTd">{user.email}</td>
                    <td className="tableTd">{user.gender ? `${user.gender}` : "Not updated"}</td>
                    <td className="tableTd">{user.isVerified ? "Verified" : "Not verified"}</td>
                    <td className="tableTd">
                    {moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                  <td className="border border-slate-300 px-2 lg:px-4 py-2 text-center">
                    <Button variant="error" onClick={() => openModal(user._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Pagination currentPage={currentPage} totalPage={totalPage} pageCount={pageCount} onPageChange={setCurrentPage} />
      <Modal showModal={showModal} title="Are you sure you want to delete this user?" onConfirm={() => handleDelete(userId)} onCancel={closeModal} />
    </motion.div>
  );
};

export default Users;
