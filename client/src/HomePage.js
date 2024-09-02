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
          <div class="text-film">
              <filmtitle>Lorem</filmtitle>
              <subtitle>Watch Lorem Trailer</subtitle>
          </div>
          <div class="play-button-container">
            <button class="play-button">
              <span class="play-icon">▶</span>
            </button>
          </div>
        </div>
      </body>
      <div class="next-film">
          <upnext>Up next</upnext>
          <ul>
          {movies.map((movie, index) => (
            <li key={index}>
            <div class="square">
              <div class="item">
              <img src={`/img/poster/${movie.image}.jpg`} alt={movie.name} className="styled-image-preview"/>
              <Link to={`/movie/${encodeURIComponent(movie.name)}`}>
                <div class="play-button-container-mini">
                  <button class="play-button-mini">
                    <span class="play-icon-mini">▶</span>
                  </button>
                </div>
              </Link> - {movie.genre}
              </div>
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