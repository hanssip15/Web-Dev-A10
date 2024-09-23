import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import MovieDetailPage from './MovieDetailPage';
import Login from './Login'; // Import halaman login

function App() {
  return (
    <Router>
      <Routes>
        {/* Route untuk HomePage */}
        <Route path="/" element={<HomePage />} />

        {/* Route untuk MovieDetailPage */}
        <Route path="/movie/:title" element={<MovieDetailPage />} />

        {/* Route untuk halaman Login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
