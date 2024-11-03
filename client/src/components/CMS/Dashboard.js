// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [adminData, setAdminData] = useState(null);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.get('/api/admin/stats', config);
      setAdminData(response.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      alert('Access denied or invalid token');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (!adminData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Total Movies: {adminData.totalMovies}</p>
      <p>Total Users: {adminData.totalUsers}</p>
      <p>Total Reviews: {adminData.totalReviews}</p>
      <p>Pending Movie Requests: {adminData.pendingRequests}</p>
    </div>
  );
};

export default Dashboard;