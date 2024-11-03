import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
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

  return (
    <div>
      <h2>Manage Movies</h2>
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