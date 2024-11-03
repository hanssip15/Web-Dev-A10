import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetailPage.css';
import MHeader from './components/MHeader.js';

function MovieDetailPage() {
  const { title } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);  
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/api/movies/${encodeURIComponent(title)}`);
        setMovie(res.data);
      } catch (error) {
        setErrorMessage('Failed to load movie details or reviews.');
      }
    };

    fetchMovie();
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (rating === 0) {
      setErrorMessage('Rating is required.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('You must be logged in to submit a review.');
        return;
      }
  
      await axios.post(
        '/api/movies/rate',
        {
          title: movie.title,
          rating,
          reviewText: comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRating(0);
      setComment('');
      setErrorMessage('');
      setSuccessMessage('Review submitted successfully!');
  
      // Fetch ulang data movie untuk mendapatkan review terbaru
      const res = await axios.get(`/api/movies/${encodeURIComponent(movie.title)}`);
      setMovie(res.data); // Update movie dengan data terbaru
    } catch (error) {
      setErrorMessage('Failed to submit review. Please try again.');
      console.error("Error submitting review:", error);
    }
  };
  
  const handleRatingClick = (index) => {
    setRating(index);
  };
  
  const handleMouseEnter = (index) => {
    setHoverRating(index);
  };
  
  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <link rel="stylesheet" href="/css/style.css"></link>
      <MHeader />
      <div className="movie-detail-container">
        <div className="image-container">
        <img
          src={movie.image}
          alt={movie.title}
          className="styled-image"
        />
          <div className='content-container'>
            <h1 className="custom-h1">{movie.title}</h1>
            <p>
              <strong>Synopsis:</strong> {movie.synopsis}
            </p>
            <p>
              <strong>Country:</strong> {movie.country ? movie.country.name : 'Unknown'}
            </p>
            <p>
              <strong>Genre:</strong> {movie.genre ? movie.genre.map(g => g.name).join(', ') : 'N/A'}
            </p>
            <p>
              <strong>Actor:</strong> {movie.actor ? movie.actor.map(a => a.name).join(', ') : 'Unknown'}
            </p>
            <p>
              <strong>Release Year:</strong> {movie.releaseYear}
            </p>
            <p>
              <strong>Average Rating:</strong> {movie.averageRating ? movie.averageRating.toFixed(1) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="review-detail-container">
        <h3>Submit Your Review</h3>
        <form onSubmit={handleSubmit} className="review-form">
        <div className="star-rating">
          {[...Array(5)].map((_, index) => {
            return (
              <span
                key={index}
                className={`star ${index < (hoverRating || rating) ? 'filled' : ''}`}
                onClick={() => handleRatingClick(index + 1)}
                onMouseEnter={() => handleMouseEnter(index + 1)}
                onMouseLeave={handleMouseLeave}
              >
                &#9733; {/* Unicode untuk simbol bintang */}
              </span>
            );
          })}
        </div>
          <input
            type="text"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="review-input"
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <div className="review-container">
          <h3>Reviews</h3>
          {movie.reviews && movie.reviews.length > 0 ? (
            movie.reviews.map((review, index) => (
              <div key={index} className="review-item">
                <p>
                  Name: <strong>{review.userId.name || 'Anonymous'}</strong>
                </p>
                <p>Rate: {review.rating}/5</p>
                <p>Comment: {review.reviewText}</p>
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