import React, {useEffect, useState} from 'react'
import SearchBar from '../component/search/SearchBar.jsx'
import axios from '../utils/axiosInstance.js'
import { toast } from 'sonner'
import moment from 'moment'
import Button from '../component/button/Button.jsx'
import Pagination from '../component/pagination/Pagination.jsx'
import Modal from '../component/modal/Modal.jsx'
import {useAuth} from '../component/context/useAuth.jsx'
import { useSocket } from '../component/context/useSocket.jsx'

const AdminList = () => {

    const auth = useAuth();
    const socket = useSocket();

    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState([]);
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
            const response = await axios.get('/admin/admin-list', {
              params: {
                page: currentPage,
                size: 10,
                sortField,
                sortOrder,
                q: searchQuery,
              },
            });
            const data = response.data;
            setAdmins(data.admins);
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
      socket.on("Admin-previlages-changed", (data) => {
        if(socket){
          setAdmins((prevAdmins) => prevAdmins.filter(admin => admin._id !== data.id));
        } else {
          console.error('Socket is undefined');
        }
      })
      return () => {
        if (socket) socket.off("Admin-previlages-changed");  // Clean up the event listener
     };

    }, [socket])

    const handleRemoveAdmin = async (userId) => {
      try{

        const response = await axios.put(`/admin/remove-privilages/${userId}`)
        const data = response.data;
        toast.success(data.message)
        if(socket){
          socket.emit('Admin-previlages-changed', {id : userId})
        }else {
          console.error("Socket is undefined")
        }

        closeModal()

      }catch(error){
        const response = error.response
        const data = response.data
        toast.error(data.message)
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
    <div>
        <div>
            <div>
                <h2 className='title'>Administrative Users</h2>
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
            <table className="">
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
                    
                    {auth.role === 1 && (
                        <th className="tableTh">Action</th>
                    )}
                    
                </tr>
                </thead>
                <tbody>
                {admins.map((admin) => (
                    <tr key={admin._id} className="border border-slate-300 hover:bg-gray-50">
                        {/* <td className="border border-slate-300 px-2 lg:px-4 py-2">{user._id}</td> */}
                        <td className="tableTd">{admin.firstName} {admin.lastName}</td>
                        <td className="tableTd">{admin.email}</td>
                        <td className="tableTd capitalize">{admin.gender ? `${admin.gender}` : "Not updated"}</td>
                        <td className="tableTd">{admin.isVerified ? "Verified" : "Not verified"}</td>
                        <td className="tableTd">
                        {moment(admin.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </td>
                    {auth.role === 1 && (
                        <td className="border border-slate-300 px-2 lg:px-4 py-2 text-center">
                            <Button variant="error" onClick={() => openModal(admin._id)}>Dismiss Admin</Button>
                        </td>
                    )}
                   
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      
        <Pagination currentPage={currentPage} totalPage={totalPage} pageCount={pageCount} onPageChange={setCurrentPage} />
        <Modal showModal={showModal} title="Are you sure you want to revoke this user's admin privileges?" onConfirm={() => handleRemoveAdmin(userId)} onCancel={closeModal} />
    </div>
  )
}

export default AdminList