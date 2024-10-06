import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Tidak perlu destructuring
import './MovieDetailPage.css';

function MovieDetailPage() {
  const { title } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]); // State untuk reviews
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State untuk search query
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk login
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieAndReviews = async () => {
      try {
        const movieRes = await axios.get(`/api/movies/${encodeURIComponent(title)}`);
        setMovie(movieRes.data);

        const reviewsRes = await axios.get(`/api/movies/${encodeURIComponent(title)}/reviews`);
        setReviews(reviewsRes.data);
      } catch (error) {
        setErrorMessage('Failed to load movie details or reviews.');
      }
    };

    fetchMovieAndReviews();

    // Cek status login dari token
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [title]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === '') {
      setErrorMessage('Rating is required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('You must be logged in to submit a review.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const decodedToken = jwtDecode(token);
      const response = await axios.post(
        '/api/movies/rate',
        {
          title: movie.title,
          rating,
          reviewText,
          name: decodedToken.name,
          username: decodedToken.username,
        },
        config
      );

      setRating('');
      setReviewText('');
      setErrorMessage('');
      setSuccessMessage('Review submitted successfully!');
      setReviews([...reviews, response.data.review]); // Menambahkan review baru ke state tanpa reload
    } catch (error) {
      setErrorMessage('Failed to submit review. Please try again.');
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <header>
        <logo>
          <Link to="/">Movie Review</Link>
        </logo>
        <menu>Menu</menu>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Movie"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
        <watchlist>Watchlist</watchlist>
        <div className="signin-container">
          {isLoggedIn ? (
            <button className="signout-button" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="signin-link">
              Sign In
            </Link>
          )}
        </div>
        <language>EN</language>
      </header>

      <div className="movie-detail-container">
        <h1>{movie.title}</h1>
        <div className="image-container">
          <img
            src={`/img/poster/${movie.image}.jpg`}
            alt={movie.title}
            className="styled-image"
          />
        </div>
        <p>
          <strong>Country:</strong> {movie.country}
        </p>
        <p>
          <strong>Genre:</strong> {movie.genre.join(', ')}
        </p>
        <p>
          <strong>Actors:</strong> {movie.actor ? movie.actor.join(', ') : 'Unknown'}
        </p>
        <p>
          <strong>Release Year:</strong> {movie.releaseYear}
        </p>
        <p>
          <strong>Synopsis:</strong> {movie.synopsis}
        </p>

        <h3>Submit Your Review</h3>
        <form onSubmit={handleSubmit} className="review-form">
          <input
            type="number"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="review-input"
            min="1"
            max="5"
          />
          <input
            type="text"
            placeholder="Comment"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="review-input"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <div className="review-container">
          <h3>Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="review-item">
                <p>
                  <strong>{review.userId.name}</strong>
                </p>
                <p>Rate: {review.rating}/5</p>
                <p>Comment: {review.reviewText}</p>
                <p>Date: {new Date(review.reviewDate).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;