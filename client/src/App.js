import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import MovieDetailPage from './MovieDetailPage';
import Login from './LoginRegister';
import SearchFilter from './SearchFilter';
import MovieRequestForm from './MovieRequestForm';
import MovieRequestAdmin from './MovieRequestAdmin';

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

        {/* Route untuk halaman Search */}
        <Route path="/search" element={<SearchFilter />} />

        {/* Route untuk halaman Request Movie */}
        <Route path="/request-movie" element={<MovieRequestForm />} />
      
        {/* Route untuk halaman admin */}
        <Route path="/admin/movie-requests" element={<MovieRequestAdmin />} /> 
      </Routes>
    </Router>
  );
}

export default App;