import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      <ul>
        <p>
          <strong>Nama:</strong> {currentUser.name}
        </p>
        <p>
          <strong>Username:</strong> {currentUser.username}
        </p>
        <p>
          <strong>ID:</strong> {currentUser._id}
        </p>
      </ul>
    </div>
  );

  return (
    <div>
      <h2>Manage Users</h2>
      {currentUserInfo}
      <p>
        <strong>List Akun:</strong>
      </p>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Status:</strong> {user.suspendUntil ? 'Suspended' : 'Active'}
              </p>
              {user.suspendUntil && (
                <p>
                  <strong>Suspended Until:</strong> {new Date(user.suspendUntil).toLocaleString()}
                </p>
              )}
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
            </li>
          ))}
        </ul>
      ) : (
        <p>No other users found.</p>
      )}
    </div>
  );
};

export default ManageUsers;