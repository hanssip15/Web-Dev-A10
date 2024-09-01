import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movieRes = await axios.get('/api/movies');
      setMovies(movieRes.data);
    };

    fetchData();
  }, []);

  return (
    <div>

      <header>
        <logo>Movie Review</logo>
        <menu>Menu</menu>
        <div class="search-container">
            <input type="text" placeholder="Search Movie" class="search-input"/>
            <button type="submit" class="search-button">Search</button>
        </div>
        <watchlist>Watchlist</watchlist>
        <signin>Sign In</signin>
        <language>EN</language>
      </header>

      <body>
        <div class="image-container">
          <img src="/img/film1.jpg" alt="Boboiboy Movie" class="styled-image"/>
          <div class="gradient-overlay"></div>
          <div class="next-film"></div>
            <upnext>Up next</upnext>
            <div class="square"></div> 
        </div>
 
      </body>
      <h1>Movie Reviews</h1>
      <link rel="stylesheet" href="/css/style.css"></link>
      <h2>Movies</h2>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <Link to={`/movie/${encodeURIComponent(movie.name)}`}>{movie.name}</Link> - {movie.genre}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;