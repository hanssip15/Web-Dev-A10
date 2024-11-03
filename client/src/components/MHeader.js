import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function MHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Cek status login dan role admin saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsLoggedIn(true);
      setIsAdmin(decodedToken.role === 'admin'); // Cek apakah user adalah admin
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Hapus token dari localStorage
    setIsLoggedIn(false); // Set status menjadi logout
    setIsAdmin(false); // Reset status admin
    navigate('/'); // Redirect ke halaman utama
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      <header>
        <link rel="stylesheet" href="/css/style.css"></link>
        <logo><Link to={'/'} className='custom-link'>MovieReview</Link></logo>
        <div className="dropdown">
          <button className="btn btn-danger dropdown-toggle" type="button" id="menuDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            Menu
          </button>
          <ul className="dropdown-menu" aria-labelledby="menuDropdown">
            <li><Link className="dropdown-item" to="/trending">Trending Movies</Link></li>
            <li><Link className="dropdown-item" to="/new-releases">New Releases</Link></li>
            {isAdmin && (
              <li><Link className="dropdown-item" to="/admin/dashboard">Admin Dashboard</Link></li> // Link ke CMS admin
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
    </div>
  );
}

export default MHeader;