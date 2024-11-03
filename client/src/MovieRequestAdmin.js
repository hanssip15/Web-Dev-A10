import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MovieRequestAdmin() {
  const [requests, setRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fungsi untuk mengambil daftar permintaan film dari backend
  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get('/api/movie-requests', config);
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching movie requests:', error);
        setErrorMessage('Failed to load movie requests.');
      }
    };

    fetchRequests();
  }, []);

  // Fungsi untuk menyetujui permintaan film
  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.put(
        `/api/movie-requests/${id}`,
        { status: 'approved' },
        config
      );

      // Setelah disetujui, hapus permintaan dari daftar
      setRequests(requests.filter((request) => request._id !== id));
      alert('Movie approved and added successfully!');
    } catch (error) {
      console.error('Error approving movie request:', error);
      setErrorMessage('Failed to approve movie request.');
    }
  };

  // Fungsi untuk menolak permintaan film
  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.put(
        `/api/movie-requests/${id}`,
        { status: 'rejected' },
        config
      );

      // Setelah ditolak, hapus permintaan dari daftar
      setRequests(requests.filter((request) => request._id !== id));
      alert('Movie request rejected.');
    } catch (error) {
      console.error('Error rejecting movie request:', error);
      setErrorMessage('Failed to reject movie request.');
    }
  };

  return (
    <div>
      <h1>Manage Movie Requests</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {requests.length > 0 ? (
        requests.map((request) => (
          <div key={request._id}>
            <h3>{request.title}</h3>
            <p>{request.description}</p>
            <button onClick={() => handleApprove(request._id)}>Approve</button>
            <button onClick={() => handleReject(request._id)}>Reject</button>
          </div>
        ))
      ) : (
        <p>No movie requests pending.</p>
      )}
    </div>
  );
}

export default MovieRequestAdmin;