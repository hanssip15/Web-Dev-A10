import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MHeader from './components/MHeader.js';
  
function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Redirect ke halaman SearchFilter dengan query string
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  // Cek status login saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem('token'); // Cek token di localStorage
    if (token) {
      setIsLoggedIn(true); // Jika token ada, pengguna sudah login
    } else {
      setIsLoggedIn(false); // Jika tidak ada token, pengguna belum login
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Hapus token dari localStorage
    setIsLoggedIn(false); // Set status menjadi logout
    window.location.href = '/'; // Redirect ke halaman utama
  };

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