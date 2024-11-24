import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MHeader from './components/MHeader.js';

function MovieRequestForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: [], // Array untuk menyimpan ID genre yang dipilih
    year: ''
  });
  const [genres, setGenres] = useState([]); // Untuk menyimpan daftar genre dari backend
  const [movieRequests, setMovieRequests] = useState([]); // Untuk menyimpan daftar movie requests
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fungsi untuk mendapatkan genre dari backend
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/api/genres'); // Panggil endpoint untuk mendapatkan genre
        setGenres(response.data); // Simpan genre di state
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };

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

    fetchGenres();
    fetchMovieRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validasi Release Year
    const currentYear = new Date().getFullYear();
    const firstMovieYear = 1888; // Tahun rilis film pertama ("Roundhay Garden Scene")
    const releaseYear = parseInt(formData.year, 10);
  
    // Validasi apakah year adalah angka dan dalam rentang yang valid
    if (isNaN(releaseYear) || releaseYear < firstMovieYear || releaseYear > currentYear) {
      setMessage(`Release Year must be a valid integer between ${firstMovieYear} and ${currentYear}.`);
      return;
    }
  
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const payload = {
      ...formData,
      year: releaseYear, // Pastikan year dikirim sebagai angka
    };
  
    try {
      const response = await axios.post('/api/movie-requests', payload, config);
      setMessage(response.data.message);
      setFormData({ title: '', description: '', genre: [], year: '' }); // Reset form setelah submit
      // Refresh daftar request setelah submit
      const fetchRequests = await axios.get('/api/user/movie-requests', config);
      setMovieRequests(fetchRequests.data);
    } catch (error) {
      console.error('Error submitting movie request:', error);
      setMessage('Failed to submit request');
    }
  };  

  const handleGenreChange = (id) => {
    setFormData((prev) => {
      const genres = prev.genre.includes(id)
        ? prev.genre.filter((genreId) => genreId !== id) // Hapus jika sudah ada
        : [...prev.genre, id]; // Tambahkan jika belum ada
      return { ...prev, genre: genres };
    });
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
        <label>
          Description:
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
        </label>
        <label>
          Genre:
          <div>
            {genres.map((genre) => (
              <div key={genre._id}>
                <input
                  type="checkbox"
                  id={`genre-${genre._id}`}
                  value={genre._id}
                  checked={formData.genre.includes(genre._id)}
                  onChange={() => handleGenreChange(genre._id)}
                />
                <label htmlFor={`genre-${genre._id}`}>{genre.name}</label>
              </div>
            ))}
          </div>
        </label>
        <label>
          Release Year:
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}

      {/* Daftar Movie Requests */}
      <div>
        <br />
        <h1>Your Movie Requests</h1>
        {error && <p className="error">{error}</p>}
        <ul>
          {movieRequests.map((request) => (
            <li key={request._id}>
              <h3>{request.title}</h3>
              <p>{request.description}</p>
              <p>Genre: {request.genre.map((g) => genres.find((genre) => genre._id === g)?.name || g).join(', ')}</p>
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