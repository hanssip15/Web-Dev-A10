import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbarcms';
import Header from './CMSHeader';


const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch daftar user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data.currentUser);
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

  // Menampilkan informasi akun yang sedang dipakai
  const currentUserInfo = currentUser && (
    <div>
      <p>
        <strong>Akun yang sekarang digunakan:</strong>
      </p>
      <ul>
        <p>
          <strong>Nama:</strong> {currentUser.name}
          <br/>
          <strong>Username:</strong> {currentUser.username}
          <br/>
          <strong>ID:</strong> {currentUser._id}
        </p>
      </ul>
    </div>
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
                                {currentUserInfo}
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
                                                    <td>
                                                      {user.suspendUntil ? (
                                                        `Suspended Until: ${new Date(user.suspendUntil).toLocaleString()}`
                                                      ) : (
                                                        "Active"
                                                      )}
                                                      </td>
                                                    <td>
                                                      <button onClick={() => handleSuspend(user._id, '1h')}>Suspend 1 Hour</button>
                                                      <button onClick={() => handleSuspend(user._id, '3h')}>Suspend 3 Hours</button>
                                                      <button onClick={() => handleSuspend(user._id, '6h')}>Suspend 6 Hours</button>
                                                      <button onClick={() => handleSuspend(user._id, '12h')}>Suspend 12 Hours</button>
                                                      <button onClick={() => handleSuspend(user._id, '1d')}>Suspend 1 Day</button>
                                                      <button onClick={() => handleSuspend(user._id, '2d')}>Suspend 2 Days</button>
                                                      <button onClick={() => handleSuspend(user._id, '3d')}>Suspend 3 Days</button>
                                                      <button onClick={() => handleUnsuspend(user._id)}>Unsuspend</button>
                                                      <button onClick={() => handleDelete(user._id)} style={{ color: 'red' }}>
                                                        Delete User
                                                      </button>
                                                    </td>
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