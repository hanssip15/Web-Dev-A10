import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function MHeader() {
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
        <link rel="stylesheet" href="/css/style.css"></link>
        <logo> <Link to={'/'} className='custom-link'>MovieReview</Link></logo>
        <listmenu>Menu</listmenu>
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
        <div className="signin-container"></div>
        {/* Kondisi jika pengguna sudah login atau belum */}
        <div className="signin-container">
        {isLoggedIn ? (
          <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
        ) : (
          <Link to="/login" className="signin-link">Sign In</Link>
        )}
        </div>
        <language>EN</language>
      </header>
    </div>
  );
}

export default MHeader;