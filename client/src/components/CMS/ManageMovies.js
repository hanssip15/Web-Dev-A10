import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null); // Untuk menyimpan data film yang sedang diedit
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/admin/movies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [token]);

  const deleteMovie = async (movieId) => {
    try {
      await axios.delete(`/api/admin/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(movies.filter(movie => movie._id !== movieId));
      alert('Movie deleted successfully');
    } catch (error) {
      console.error("Failed to delete movie:", error);
      alert('Failed to delete movie');
    }
  };

  const startEditing = (movie) => {
    setEditingMovie(movie);
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditingMovie({ ...editingMovie, [e.target.name]: e.target.value });
  };

  const submitEdit = async () => {
    try {
      await axios.put(`/api/admin/movies/${editingMovie._id}`, editingMovie, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(movies.map(movie => movie._id === editingMovie._id ? editingMovie : movie));
      setIsEditing(false);
      alert('Movie details updated successfully');
    } catch (error) {
      console.error("Failed to update movie:", error);
      alert('Failed to update movie');
    }
  };

  return (
    <div>
      <h2>Manage Movies</h2>
      {isEditing ? (
        <div>
          <h3>Edit Movie: {editingMovie.title}</h3>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={editingMovie.title}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Release Year:
            <input
              type="number"
              name="releaseYear"
              value={editingMovie.releaseYear}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Average Rating:
            <input
              type="number"
              name="averageRating"
              step="0.1"
              value={editingMovie.averageRating}
              onChange={handleEditChange}
            />
          </label>
          <button onClick={submitEdit}>Save Changes</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          {movies.length > 0 ? (
            <ul>
              {movies.map(movie => (
                <li key={movie._id}>
                  <h3>{movie.title}</h3>
                  <p>Country: {movie.country?.name || "Unknown"}</p>
                  <p>Genre: {movie.genre.map(g => g.name).join(", ")}</p>
                  <p>Actors: {movie.actor.map(a => a.name).join(", ")}</p>
                  <p>Release Year: {movie.releaseYear}</p>
                  <p>Average Rating: {movie.averageRating}</p>
                  <button onClick={() => startEditing(movie)}>Edit</button>
                  <button onClick={() => deleteMovie(movie._id)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No movies found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ManageMovies;