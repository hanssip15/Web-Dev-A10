import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './SearchFilter.css';
import MHeader from './components/MHeader.js';

function SearchFilter() {
  const [movies, setMovies] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [country, setCountry] = useState('');
  const [visibleMovies, setVisibleMovies] = useState(8);
  const location = useLocation();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);

  // Fetch genres and countries for dropdown filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [genreRes, countryRes] = await Promise.all([
          axios.get('/api/genres'), // Assuming these endpoints exist
          axios.get('/api/countries')
        ]);
        setGenres(genreRes.data);
        setCountries(countryRes.data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  // Fetch movies based on search and filter
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query');
    setSearchQuery(query || '');

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
  }, [location.search, genre, country]);

  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const loadMoreMovies = () => {
    setVisibleMovies((prevVisibleMovies) => prevVisibleMovies + 8);
  };

  return (
    <div>
      <MHeader />

      <h1>Search Results</h1>

      <div className="filter-container">
        <h3>Filter Movies</h3>
        <div className="filter-controls">
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
          </select>

          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {notFound ? (
        <p>No movies found.</p>
      ) : (
        <div className="movie-grid">
          {movies.slice(0, visibleMovies).map((movie, index) => (
            <Link key={index} to={`/movie/${encodeURIComponent(movie.title)}`} className="movie-card">
              <div className="image-container">
              <img
                src={movie.image}
                alt={`${movie.title} Poster`}
                className="styled-image"
              />
              </div>
              <div className="movie-details">
                <h3>{movie.title}</h3>
                <p>{movie.releaseYear}</p>
                <p>{movie.genre.map(g => g.name).join(', ')}</p>
                <p>{movie.country ? movie.country.name : 'Unknown'}</p>
                <p>{movie.actor.map(a => a.name).join(', ')}</p>
              </div>
            </Link>
          ))}
          {visibleMovies < movies.length && (
            <button onClick={loadMoreMovies} className="load-more-button">Load More...</button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchFilter;