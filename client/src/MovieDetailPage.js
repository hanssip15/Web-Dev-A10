import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetailPage.css';

function MovieDetailPage() {
  const { name } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Tambahkan state untuk pesan kesalahan

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await axios.get('/api/movies');
      const foundMovie = res.data.find(movie => movie.name === decodeURIComponent(name));
      setMovie(foundMovie);
    };

    fetchMovie();
  }, [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input rating dan comment
    if (rating === '') {
      setErrorMessage('Rating is required.'); // Setel pesan kesalahan
      return;
    }

    try {
      await axios.post('/api/movies/rate', { name: movie.name, rating, comment });
      setRating('');
      setComment('');
      setErrorMessage(''); // Reset pesan kesalahan setelah submit berhasil
      window.location.reload();
    } catch (error) {
      setErrorMessage('Failed to submit review. Please try again.');
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <header>
      <a href="http://localhost:3000/" className="logo">Movie Review</a>
        <listmenu>Menu</listmenu>
        <div className="search-container">
          <input type="text" placeholder="Search Movie" className="search-input"/>
          <button type="submit" className="search-button">Search</button>
        </div>
        <watchlist>Watchlist</watchlist>
        <signin>Sign In</signin>
        <language>EN</language>
      </header>

      <div className="movie-detail-container">
        <h1>{movie.name}</h1>
        <div className="image-container">
          <img src={`/img/poster/${movie.image}.jpg`} alt={movie.name} className="styled-image"/>
        </div>
        <p><strong>Country:</strong> {movie.country}</p>
        <p><strong>Genre:</strong> {movie.genre}</p>
        <p><strong>Actors:</strong> {movie.actors.join(', ')}</p>
        
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
          <button type="submit" className="submit-button">Submit</button>
        </form>

        {/* Tampilkan pesan kesalahan jika ada */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
      
      <div className="review-container">
        {/* Bagian untuk menampilkan reviews */}
        <h3>Reviews</h3>
        {movie.reviews && movie.reviews.length > 0 ? (
          movie.reviews.map((review, index) => (
            <div key={index} className="review-item">
              <p>Username: <strong>user</strong></p>
              <p>Rate: {review.rating}/5</p>
              <p>Comment: {review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default MovieDetailPage;