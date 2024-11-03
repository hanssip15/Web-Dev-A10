import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import MovieDetailPage from './MovieDetailPage';
import Login from './LoginRegister';
import SearchFilter from './SearchFilter';
import MovieRequestForm from './MovieRequestForm';
import CMSLayout from './components/CMS/CMSLayout';
import Dashboard from './components/CMS/Dashboard';
import ManageMovies from './components/CMS/ManageMovies';
import ManageRequests from './components/CMS/ManageRequests';
import ManageReviews from './components/CMS/ManageReviews';
import ManageUsers from './components/CMS/ManageUsers';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route untuk halaman utama */}
        <Route path="/" element={<HomePage />} />

        {/* Route untuk halaman detail film */}
        <Route path="/movie/:title" element={<MovieDetailPage />} />

        {/* Route untuk halaman Login */}
        <Route path="/login" element={<Login />} />

        {/* Route untuk halaman Search */}
        <Route path="/search" element={<SearchFilter />} />

        {/* Route untuk halaman Request Movie */}
        <Route path="/request-movie" element={<MovieRequestForm />} />

        {/* Route untuk CMS dengan layout khusus untuk admin */}
        <Route path="/admin" element={<CMSLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="movies" element={<ManageMovies />} />
          <Route path="requests" element={<ManageRequests />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;