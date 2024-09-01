import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movieRes = await axios.get('/api/movies');
      const tvShowRes = await axios.get('/api/tvshows');
      setMovies(movieRes.data);
      setTvShows(tvShowRes.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Movie and TV Show Reviews</h1>
      
      <h2>Movies</h2>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <Link to={`/movie/${encodeURIComponent(movie.name)}`}>{movie.name}</Link> - {movie.genre}
          </li>
        ))}
      </ul>

      <h2>TV Shows</h2>
      <ul>
        {tvShows.map((show, index) => (
          <li key={index}>
            <Link to={`/tvshow/${encodeURIComponent(show.name)}`}>{show.name}</Link> - {show.genre}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;