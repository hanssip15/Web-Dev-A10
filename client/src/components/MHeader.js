import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function MHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Redirect ke halaman SearchFilter dengan query string
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Cek status login saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsLoggedIn(true);
      if (decodedToken.role === 'admin') {
        setIsAdmin(true); // Jika role admin, set isAdmin menjadi true
        console.log(decodedToken);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
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