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
  const [visibleMovies, setVisibleMovies] = useState(8); // Initial state untuk menampilkan 8 film pertama
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil query dari URL
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`/api/movies`, {
          params: {
            search: query,
            genre,
            country,
          },
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

  const loadMoreMovies = () => {
    setVisibleMovies((prevVisibleMovies) => prevVisibleMovies + 8); // Tambah 8 film lagi setiap kali "Load More" diklik
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
        <signin>Sign In</signin>
        <language>EN</language>
      </header>

      <h1>Search Results</h1>

      {/* Filter Section */}
      <div className="filter-container">
        <h3>Filter Movies</h3>
        <div className="filter-controls">
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            {/* Tambahkan genre lainnya */}
          </select>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All Countries</option>
            <option value="USA">USA</option>
            <option value="South Korea">South Korea</option>
            <option value="Japan">Japan</option>
            {/* Tambahkan negara lainnya */}
          </select>
        </div>
      </div>

      {/* Daftar film */}
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
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchFilter;