import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MHeader from './components/MHeader.js';
  
function HomePage() {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
<<<<<<< Updated upstream
=======
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
>>>>>>> Stashed changes

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
  useEffect(() => {
    // Fetch movie data from your database here
    // Replace this with your actual data fetching logic
    const fetchMovies = async () => {
      const response = await fetch('/your-api-endpoint');
      const data = await response.json();
      setMovies(data);
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000); // Change the interval to 5000 for 5 seconds
    return () => clearInterval(interval);
  }, [movies.length]);
<<<<<<< Updated upstream

  return (
    <div>
=======

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

  useEffect(() => {
    // Fetch movie data from your database here
    // Replace this with your actual data fetching logic
    const fetchMovies = async () => {
      const response = await fetch('/your-api-endpoint');
      const data = await response.json();
      setMovies(data);
    };
    fetchMovies();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = '/';
  };

  return (
    <div>
      <header>
        <logo> <Link to="/">Movie Review</Link></logo>
        <div className="dropdown">
          <button className="btn btn-danger dropdown-toggle" type="button" id="menuDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            Menu
          </button>
          <ul className="dropdown-menu" aria-labelledby="menuDropdown">
            <li><Link className="dropdown-item" to="/trending">Trending Movies</Link></li>
            <li><Link className="dropdown-item" to="/new-releases">New Releases</Link></li>
            {isAdmin && (
              <li><Link className="dropdown-item" to="/admin/movie-requests">Manage Movie Requests</Link></li>
            )}
            {isLoggedIn && (
              <li><Link className="dropdown-item" to="/request-movie">Request a Movie</Link></li>
            )}
          </ul>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Movie"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>
        <watchlist>Watchlist</watchlist>
        <div className="signin-container">
        {isLoggedIn ? (
          <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
        ) : (
          <Link to="/login" className="signin-link">Sign In</Link>
        )}
        </div>
        <language>EN</language>
      </header>

      <body>
        <div className="image-container">
            {movies.length > 0 && (
              <>
                <img 
                  src={`/img/poster/${movies[currentMovieIndex].image}.jpg`} 
                  alt={movies[currentMovieIndex].title} 
                  className="styled-image" 
                />
                <div className="movie-details">
                  <h2>{movies[currentMovieIndex].title}</h2> {/* Nama film */}
                  <p>{movies[currentMovieIndex].synopsis}</p> {/* Sinopsis film */}
                  <Link to={`/movie/${encodeURIComponent(movies[currentMovieIndex].title)}`} className='moreButton'> More Contents
                  </Link>
                </div>
              </>
            )}
        </div>
        <div class="next-film">
            <upnext>Up next</upnext>
            <ul>
              {movies.map((movie, index) => (
              <li key={index}>
                <div class="item">
                <img src={`/img/poster/${movie.image}.jpg`} alt={movie.title} className="styled-image-preview"/>
                <Link to={`/movie/${encodeURIComponent(movie.title)}`}>
                  <div class="play-button-container-mini">
                  <div class="play-mtitle">{movie.title}
                    <button class="play-button-mini">
                      <span class="play-icon-mini">▶</span>
                    </button>
                    </div>
                  </div>
                </Link>
                </div>
              </li>
            ))}
            </ul>
            <browse>Browse trailers </browse>
        </div>
      </body>
      
>>>>>>> Stashed changes
      <link rel="stylesheet" href="/css/style.css"></link>
      <MHeader/>
        <body>
        <div className="image-container">
            {movies.length > 0 && (
              <>
                <img 
                  src={`/img/poster/${movies[currentMovieIndex].image}.jpg`} 
                  alt={movies[currentMovieIndex].title} 
                  className="styled-image" 
                />
                <div className="movie-details">
                  <h2>{movies[currentMovieIndex].title}</h2> {/* Nama film */}
                  <p>{movies[currentMovieIndex].synopsis}</p> {/* Sinopsis film */}
                  <Link to={`/movie/${encodeURIComponent(movies[currentMovieIndex].title)}`} className='moreButton'> More Contents
                  </Link>
                </div>
              </>
            )}
        </div>
        <div class="next-film">
            <upnext>Up next</upnext>
            <ul>
              {movies.map((movie, index) => (
              <li key={index}>
                <div class="item">
                <img src={`/img/poster/${movie.image}.jpg`} alt={movie.title} className="styled-image-preview"/>
                <Link to={`/movie/${encodeURIComponent(movie.title)}`}>
                  <div class="play-button-container-mini">
                  <div class="play-mtitle">{movie.title}
                    <button class="play-button-mini">
                      <span class="play-icon-mini">▶</span>
                    </button>
                    </div>
                  </div>
                </Link>
                </div>
              </li>
            ))}
            </ul>
            <browse>Browse trailers </browse>
        </div>
      </body>

    </div>
  );
}
export default HomePage;