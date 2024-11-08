import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance.js'
import Pagination from '../component/pagination/Pagination.jsx';
import Button from '../component/button/Button.jsx';
import Modal from '../component/modal/Modal.jsx';
import moment from 'moment';
import { toast } from 'sonner';
import SearchBar from '../component/search/SearchBar.jsx';
import { useSocket } from '../hooks/useSocket.jsx';

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

  useEffect(()=> {
    const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await axios.get('/user/all-users', {
            params: {
              page: currentPage,
              size: 10,
              sortField,
              sortOrder,
              q: searchQuery,
            },
          });
          const data = response.data;
          setUsers(data.users);
          setTotalPage(data.pages || 1);
        } catch (error) {
          toast.error('Failed to fetch users');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers()
  }, [currentPage, sortField, sortOrder, searchQuery])

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
        console.log('User-deleted:', data);
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
      toast.success(response.data.message);
      setShowModal(false);

      if(socket){
        socket.emit('User-deleted', {id})
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== id));
      }else{
        console.error('Socket is undefined');
      }
    } catch (error) {
      const response = error.response;
      const data = response.data
      console.log(data)
      toast.error('Failed to delete user');
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page for new search results
  };

  return (
    <>
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
                <tr key={user._id} className="border border-slate-300 hover:bg-gray-50">
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
    </>
  );
};

export default Users;
