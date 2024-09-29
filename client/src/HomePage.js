import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Redirect ke halaman SearchFilter dengan query string
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
        <logo> <Link to="/">Movie Review</Link></logo>
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
    </div>
  );
}

export default HomePage;