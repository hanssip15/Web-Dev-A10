import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MovieRequestForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah pengguna sudah login dengan melihat token
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setErrorMessage('You must be logged in to request a movie.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      const requestData = {
        title,
        description,
        genre: genre.split(',').map(g => g.trim()), // Split genre by comma
        year,
      };

      // Kirim request film ke backend
      await axios.post('/api/movie-requests', requestData, config);
      setSuccessMessage('Movie request submitted successfully!');
      setTitle('');
      setDescription('');
      setGenre('');
      setYear('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to submit movie request. Please try again.');
    }
  };

  // Jika belum login, tampilkan pesan untuk login terlebih dahulu
  if (!isLoggedIn) {
    return (
      <div>
        <h2>You must be logged in to request a movie</h2>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    );
  }

  // Form pengajuan request film untuk pengguna yang sudah login
  return (
    <div>
      <h2>Request a New Movie</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Genre (separated by commas)</label>
          <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
        </div>
        <div>
          <label>Year</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <button type="submit">Submit Request</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default MovieRequestForm;