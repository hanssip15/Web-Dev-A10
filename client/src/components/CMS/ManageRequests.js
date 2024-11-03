import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      const response = await axios.get('/api/movie-requests', config);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching movie requests:', error);
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.put(`/api/movie-requests/${id}`, { status: 'approved' }, config);
      setRequests(requests.filter(request => request._id !== id));
      alert('Movie request approved');
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.put(`/api/movie-requests/${id}`, { status: 'rejected' }, config);
      setRequests(requests.filter(request => request._id !== id));
      alert('Movie request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h1>Manage Requests</h1>
      {requests.map(request => (
        <div key={request._id}>
          <h3>{request.title}</h3>
          <button onClick={() => handleApprove(request._id)}>Approve</button>
          <button onClick={() => handleReject(request._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default ManageRequests;