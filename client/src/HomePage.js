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
      <link rel="stylesheet" href="/css/style.css"></link>
      <header>
        <a href="http://localhost:3000/" className="logo">Movie Review</a>
        <listmenu>Menu</listmenu>
        <div className="search-container">
          <input type="text" placeholder="Search Movie" className="search-input"/>
          <button type="submit" className="search-button">Search</button>
        </div>
        <watchlist>Watchlist</watchlist>
        <signin>Sign In</signin>
        <language>EN</language>
      </header>
      <body>
        <div class="image-container">
          <img src="/img/film1.jpg" alt="Boboiboy Movie" class="styled-image"/>
          <div class="gradient-overlay"></div>
        </div>
      </body>
      <div class="next-film">
          <upnext>Up next</upnext>
          <ul>
          {movies.map((movie, index) => (
            <li key={index}>
              <div class="item">
              <img src={`/img/poster/${movie.image}.jpg`} alt={movie.name} className="styled-image-preview"/>
              <Link to={`/movie/${encodeURIComponent(movie.name)}`}>
                <div class="play-button-container-mini">
                  <button class="play-button-mini">
                    <span class="play-icon-mini">▶</span>
                  </button>
                </div>
              </Link>
              </div>
            </li>
           ))}
          </ul>
        </div>
      <browse>Browse trailers</browse>
    </div>
  );
}
export default HomePage;