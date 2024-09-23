import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetailPage.css';

function MovieDetailPage() {
  const { title } = useParams();  // "name" di sini sebenarnya merujuk pada title film
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Tambahkan state untuk pesan kesalahan

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/api/movies/${encodeURIComponent(title)}`); // Memanggil API Express untuk satu film berdasarkan title
        setMovie(res.data); // Setel state dengan data film yang ditemukan
      } catch (error) {
        setErrorMessage('Failed to load movie details.');
      }
    };

    fetchMovie();
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input rating dan comment
    if (rating === '') {
      setErrorMessage('Rating is required.'); // Setel pesan kesalahan
      return;
    }

    try {
      // Kirim review ke API backend (Express.js)
      await axios.post('/api/movies/rate', { title: movie.title, rating, comment });
      setRating('');
      setComment('');
      setErrorMessage(''); // Reset pesan kesalahan setelah submit berhasil
      window.location.reload(); // Reload halaman setelah submit
    } catch (error) {
      setErrorMessage('Failed to submit review. Please try again.');
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <header>
        <logo>Movie Review</logo>
        <menu>Menu</menu>
        <div className="search-container">
          <input type="text" placeholder="Search Movie" className="search-input"/>
          <button type="submit" className="search-button">Search</button>
        </div>
        <watchlist>Watchlist</watchlist>
        <signin>Sign In</signin>
        <language>EN</language>
      </header>

      <div className="movie-detail-container">
        <h1>{movie.title}</h1>
        <div className="image-container">
          <img src={`/img/poster/${movie.image}.jpg`} alt={movie.title} className="styled-image"/>
        </div>
        <p><strong>Country:</strong> {movie.country}</p>
        <p><strong>Genre:</strong> {movie.genre.join(', ')}</p>
        <p><strong>Actors:</strong> {movie.actors ? movie.actors.join(', ') : 'Unknown'}</p>
        <p><strong>Release Year:</strong> {movie.releaseYear}</p>
        <p><strong>Synopsis:</strong> {movie.synopsis}</p>
        
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
              <p>Username: <strong>{review.username || 'Anonymous'}</strong></p>
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