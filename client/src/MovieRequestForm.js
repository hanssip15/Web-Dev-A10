import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MHeader from './components/MHeader.js';

function MovieRequestForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    year: ''
  });
  const [message, setMessage] = useState('');
  const [movieRequests, setMovieRequests] = useState([]); // State untuk menyimpan daftar request
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovieRequests();
  }, []);

  const fetchMovieRequests = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get('/api/user/movie-requests', config);
      setMovieRequests(response.data); // Simpan data request ke state
    } catch (err) {
      console.error('Error fetching movie requests:', err);
      setError('Failed to fetch movie requests');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      console.log('Form Data:', formData); // Log data sebelum mengirim
      const response = await axios.post('/api/movie-requests', formData, config);
      setMessage(response.data.message);
      setFormData({ title: '', description: '', genre: '', year: '' }); // Reset form setelah submit
      fetchMovieRequests(); // Refresh daftar request setelah submit
    } catch (error) {
      console.error('Error submitting movie request:', error); // Log error dari server
      setMessage('Failed to submit request');
    }
  };

  return (
    <div>
      <MHeader />
      <h1>Request a New Movie</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
        </label>
        <br/>
        <label>
          Description:
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
        </label>
        <br/>
        <label>
          Genre (comma separated):
          <input
            type="text"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value.split(',') })}
            />
        </label>
        <br/>
        <label>
          Release Year:
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
        </label>
        <br/>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}

      {/* Daftar Movie Requests */}
      <div>
        <br/>
        <h1>Your Movie Requests</h1>
        {error && <p className="error">{error}</p>}
        <ul>
          {movieRequests.map((request) => (
            <li key={request._id}>
              <h3>{request.title}</h3>
              <p>{request.description}</p>
              <p>Genre: {request.genre.join(', ')}</p>
              <p>Year: {request.year}</p>
              <p>Status: {request.status}</p>
              <p>Requested on: {new Date(request.requestDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MovieRequestForm;