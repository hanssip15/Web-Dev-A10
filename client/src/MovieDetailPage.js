import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function MovieDetailPage() {
  const { name } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

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
    await axios.post('/api/movies/rate', { name: movie.name, rating, comment });
    setRating('');
    setComment('');
    window.location.reload();
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <h1>{movie.name}</h1>
      <p><strong>Country:</strong> {movie.country}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Actors:</strong> {movie.actors.join(', ')}</p>
      
      <h3>Submit Your Review</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <input
          type="text"
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Ratings</h3>
      <p>{movie.ratings.join(', ')}</p>

      <h3>Comments</h3>
      <p>{movie.comments.join(', ')}</p>
    </div>
  );
}

export default MovieDetailPage;