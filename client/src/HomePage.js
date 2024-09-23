import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await axios.get('/api/movies');
        setMovies(movieRes.data); // Data dari server (MongoDB)
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <header>
        <logo>Movie Review</logo>
        <menu>Menu</menu>
        <div className="search-container">
          <input type="text" placeholder="Search Movie" className="search-input" />
          <button type="submit" className="search-button">Search</button>
        </div>
        <watchlist>Watchlist</watchlist>
        <signin>Sign In</signin>
        <language>EN</language>
      </header>

      <body>
        <div className="image-container">
          <img src="/img/film1.jpg" alt="Boboiboy Movie" className="styled-image" />
          <div className="gradient-overlay"></div>
          <div className="next-film"></div>
          <upnext>Up next</upnext>
          <div className="square"></div> 
        </div>
      </body>
      
      <h1>Movie Reviews</h1>
      <link rel="stylesheet" href="/css/style.css"></link>

      <h2>Movies</h2>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <Link to={`/movie/${encodeURIComponent(movie.title)}`}>{movie.title}</Link> - {movie.genre.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;