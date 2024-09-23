import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <a href="/" className="logo">Movie Review</a>
        <listmenu>Menu</listmenu>
        <div className="search-container">
          <input type="text" placeholder="Search Movie" className="search-input" />
          <button type="submit" className="search-button">Search</button>
        </div>
        <watchlist>Watchlist</watchlist>

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