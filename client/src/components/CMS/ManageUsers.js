import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbarcms';
import Header from './CMSHeader';


const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.get('/api/admin/users', config);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      await axios.delete(`/api/admin/users/${userId}`, config);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
        <body id='page-top'>
            <div id='wrapper'>
                    <Navbar/>
                    <div id="content-wrapper" class="d-flex flex-column">
                        <div id='content'>
                            <Header/>
                            <div className='container-fluid'>
                                <h1 className='h3 mb-2 text-gray-800'>Manage Movie</h1>
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">DataTables</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Username</th>
                                                        <th>Name</th>
                                                        <th>Role</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {users.map((user) => (
                                                  <tr key={user._id}>
                                                    <td>{user.username}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.role}</td>
                                                    <td><button className="btn btn-danger btn-circle" onClick={() => deleteUser(user._id)}></button></td>
                                                  </tr>
                                                ))} 
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </body>
    </div>
  );
};

export default ManageUsers;