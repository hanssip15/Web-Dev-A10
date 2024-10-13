import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MovieRequestAdmin = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
        try {
          const response = await axios.get('/api/movie-requests', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setRequests(response.data);  // Pastikan ini sesuai dengan data yang dikembalikan dari server
        } catch (error) {
          console.error('Error fetching movie requests:', error);
        }
      };      

    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'Authorization': `Bearer ${token}` },
      };

      await axios.put(`/api/movie-requests/${id}`, { status }, config);
      setRequests(requests.filter(req => req._id !== id));
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  return (
    <div>
      <h2>Manage Movie Requests</h2>
      {requests.length > 0 ? (
        <ul>
          {requests.map((request) => (
            <li key={request._id}>
              <p>Title: {request.title}</p>
              <p>Requested by: {request.userId.username}</p>
              <button onClick={() => handleAction(request._id, 'approved')}>Approve</button>
              <button onClick={() => handleAction(request._id, 'rejected')}>Reject</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No movie requests pending.</p>
      )}
    </div>
  );
};

export default MovieRequestAdmin;