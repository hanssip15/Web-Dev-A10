import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './SearchFilter.css';

function SearchFilter() {
  const [movies, setMovies] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [country, setCountry] = useState('');
  const [visibleMovies, setVisibleMovies] = useState(8);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State isLoggedIn

  // Ambil query dari URL
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`/api/movies`, {
          params: { search: query, genre, country },
        });

        if (response.data.length > 0) {
          setMovies(response.data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setNotFound(true);
      }
    };

    fetchMovies();
  }, [query, genre, country]);

  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Tanda apakah pengguna sudah login
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const loadMoreMovies = () => {
    setVisibleMovies((prevVisibleMovies) => prevVisibleMovies + 8);
  };

  return (
    <div>
      <header>
        <logo><Link to="/">Movie Review</Link></logo>
        <menu>Menu</menu>
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

      <h1>Search Results</h1>

      <div className="filter-container">
        <h3>Filter Movies</h3>
        <div className="filter-controls">
          {/* Filter by Genre */}
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Animation">Animation</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
            <option value="Drama">Drama</option>
            <option value="Crime">Crime</option>
            <option value="Adventure">Adventure</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Romance">Romance</option>
            <option value="War">War</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
          </select>

          {/* Filter by Country */}
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All Countries</option>
            <option value="USA">USA</option>
            <option value="Japan">Japan</option>
            <option value="South Korea">South Korea</option>
            <option value="New Zealand">New Zealand</option>
          </select>
        </div>
      </div>

      {notFound ? (
        <p>Film yang dicari tidak dapat ditemukan.</p>
      ) : (
        <div className="movie-grid">
          {movies.slice(0, visibleMovies).map((movie, index) => (
            <Link key={index} to={`/movie/${encodeURIComponent(movie.title)}`} className="movie-card">
              <div className="image-container">
                <img 
                  src={`/img/poster/${movie.image}.jpg`} 
                  alt={`${movie.title} Poster`} 
                  className="styled-image"
                />
              </div>
              <div className="movie-details">
                <h3>{movie.title}</h3>
                <p>{movie.releaseYear}</p>
                <p>{movie.genre.join(', ')}</p>
                <p>{movie.actor ? movie.actor.join(', ') : 'Actors not available'}</p>
              </div>
            </Link>
          ))}
          {visibleMovies < movies.length && (
            <button onClick={loadMoreMovies} className="load-more-button">
              Load More...
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchFilter;