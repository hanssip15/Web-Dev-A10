import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbarcms';
import Header from './CMSHeader';


const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const token = localStorage.getItem('token');

  // Fetch daftar user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data.currentUserId);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  // Fungsi untuk suspend user
  const handleSuspend = async (userId, duration) => {
    try {
      await axios.put(
        `/api/admin/users/${userId}/suspend`,
        { duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`User suspended for ${duration}`);
    } catch (error) {
      console.error('Failed to suspend user:', error);
      alert('Failed to suspend user. Please try again.');
    }
  };

  // Fungsi untuk unsuspend user
  const handleUnsuspend = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}/unsuspend`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User unsuspended successfully');
    } catch (error) {
      console.error('Failed to unsuspend user:', error);
      alert('Failed to unsuspend user. Please try again.');
    }
  };

  // Fungsi untuk menghapus user
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('User deleted successfully');
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const currentUserInfo = (
    <p>
      <strong>Akun yang sedang dipakai:</strong> {currentUserId}
    </p>
  );

  return (
    <div>
        <body id='page-top'>
            <div id='wrapper'>
                    <Navbar/>
                    <div id="content-wrapper" class="d-flex flex-column">
                        <div id='content'>
                            <Header/>
                            <div className='container-fluid'>
                                <h1 className='h3 mb-2 text-gray-800'>Manage Users</h1>
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">DataTables</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                        <div class="dataTables_length" id="dataTable_length">
                                          <label>
                                            Show Entries<select name="dataTable_length" aria-controls="dataTable" class="custom-select custom-select-sm form-control form-control-sm">
                                              <option value="5">5</option><option value="25">25</option><option value="50">50</option><option value="100">100</option>
                                              </select> 
                                          </label>
                                        </div>
                                            <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Username</th>
                                                        <th>Name</th>
                                                        <th>Role</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {users.map((user) => (
                                                  <tr key={user._id}>
                                                    <td>{user.username}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.role}</td>
                                                    <td>{user.suspendUntil ? 'Suspended' : 'Active'}</td>
                                                    <td><button onClick={() => handleDelete(user._id)}></button></td>
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