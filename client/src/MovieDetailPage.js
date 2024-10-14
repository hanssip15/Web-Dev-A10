import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Tidak perlu destructuring
import './MovieDetailPage.css';
import MHeader from './components/MHeader.js';

function MovieDetailPage() {
  const { title } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]); // State untuk reviews
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const totalStars = 5; // Jumlah bintang

  const handleRatingClick = (index) => {
    setRating(index);
  };

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
      </div>
    </div>
      </body>
    </div>
    
  );
}

export default MovieDetailPage;