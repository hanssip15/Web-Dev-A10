// ManageMovies.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditMovieForm from './EditMovieForm';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch daftar film dari backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/admin/movies', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [token]);

  // Fungsi untuk mengedit film
  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
  };

  // Fungsi untuk menyimpan perubahan
  const handleSave = () => {
    setSelectedMovie(null);
    window.location.reload();
  };

  // Fungsi untuk menghapus film
  const handleDeleteMovie = async (movieId) => {
    try {
      await axios.delete(`/api/admin/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(movies.filter((movie) => movie._id !== movieId));
      alert('Movie deleted successfully');
    } catch (error) {
      console.error('Failed to delete movie:', error);
      alert('Failed to delete movie. Please try again.');
    }
  };

  return (
    <div>
      <h2>Manage Movies</h2>
      {selectedMovie && (
        <EditMovieForm
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSave={handleSave}
        />
      )}
      {movies.length > 0 ? (
        <ul>
          {movies.map((movie) => (
            <li key={movie._id}>
              <h3>{movie.title}</h3>
              <p>Country: {movie.country?.name || 'Unknown'}</p>
              <p>Genre: {movie.genre.map((g) => g.name).join(', ')}</p>
              <p>Actors: {movie.actor.map((a) => a.name).join(', ')}</p>
              <p>Release Year: {movie.releaseYear}</p>
              <p>Average Rating: {movie.averageRating}</p>
              <button onClick={() => handleEditMovie(movie)}>Edit</button>
              <button onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No movies found.</p>
      )}
    </div>
  );
};

export default ManageMovies;