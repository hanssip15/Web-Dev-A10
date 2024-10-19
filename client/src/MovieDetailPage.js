import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Tidak perlu destructuring
import './MovieDetailPage.css';
import MHeader from './components/MHeader.js';

function MovieDetailPage() {
  const { title } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const totalStars = 5; // Jumlah bintang

  const handleRatingClick = (index) => {
    setRating(index);
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/api/movies/${encodeURIComponent(title)}`);
        setMovie(res.data); // Pastikan movie diambil dari response
      } catch (error) {
        setErrorMessage('Failed to load movie details or reviews.');
      }
    };

<<<<<<< Updated upstream
    fetchMovieAndReviews();
=======
    fetchMovie();

    // Cek status login dari token
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
>>>>>>> Stashed changes
  }, [title]);

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
      const decodedToken = jwtDecode(token);

      await axios.post(
        '/api/movies/rate',
        {
          title: movie.title,
          rating,
          reviewText: comment, // Gunakan 'reviewText' untuk mengirim komentar
          name: decodedToken.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRating('');
      setComment('');
      setErrorMessage('');
      setSuccessMessage('Review submitted successfully!');

      // Fetch ulang data movie untuk mendapatkan review terbaru
      const res = await axios.get(`/api/movies/${encodeURIComponent(title)}`);
      setMovie(res.data); // Update movie dengan data terbaru

    } catch (error) {
      setErrorMessage('Failed to submit review. Please try again.');
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <link rel="stylesheet" href="/css/style.css"></link>
      <MHeader/>
      <body>
      <div className="movie-detail-container">
          <div className="image-container">
          <img
            src={`/img/poster/${movie.image}.jpg`}
            alt={movie.title}
            className="styled-image"
          />
          <div className='content-container'>
            <h1 className= "custom-h1">{movie.title}</h1>
            <p>
            <h3 className='custom-h3'> Synopsis: {movie.synopsis} </h3>
            </p>
            <p>
            <h3 className='custom-h3'> Country: {movie.country}</h3>
            </p>
            <p>
            <h3 className='custom-h3'> Genre: {movie.genre.join(', ')} </h3>
            </p>
            <p>
            <h3 className='custom-h3'> Actor: {movie.actor ? movie.actor.join(', ') : 'Unknown'} </h3>
            </p>
            <p>
            <h3 className='custom-h3'> Release Year: {movie.releaseYear} </h3>
            </p>
          </div>
          </div>
      </div>
      <div className='review-detail-container'>
      <h3>Submit Your Review</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="star-rating">
          {[...Array(totalStars)].map((_, index) => {
            return (
              <span
                key={index}
                className={`star ${index < (hoverRating || rating) ? 'filled' : ''}`}
                onClick={() => handleRatingClick(index + 1)}
                onMouseEnter={() => setHoverRating(index + 1)}
                onMouseLeave={() => setHoverRating(0)}
              >
                &#9733; {/* Unicode untuk simbol bintang */}
              </span>
            );
          })}
        </div>
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

<<<<<<< Updated upstream
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
              <p>
                <div className="star-rating">
                  {[...Array(totalStars)].map((_, i) => (
                    <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                      &#9733;
                    </span>
                  ))}
                </div>
              </p>
              <p>Comment: {review.reviewText}</p>
              <p>Date: {new Date(review.reviewDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
=======
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
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="review-input"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <div className="review-container">
          {/* Bagian untuk menampilkan reviews */}
          <h3>Reviews</h3>
          {movie.reviews && movie.reviews.length > 0 ? (
            movie.reviews.map((review, index) => (
              <div key={index} className="review-item">
                <p>
                  Name: <strong>{review.name || 'Anonymous'}</strong>
                </p>
                <p>Rate: {review.rating}/5</p>
                <p>Comment: {review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
>>>>>>> Stashed changes
      </div>
    </div>
      </body>
    </div>
    
  );
}

export default MovieDetailPage;