import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TvShowDetailPage() {
  const { name } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchTvShow = async () => {
      const res = await axios.get('/api/tvshows');
      const foundTvShow = res.data.find(show => show.name === decodeURIComponent(name));
      setTvShow(foundTvShow);
    };

    fetchTvShow();
  }, [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/tvshows/rate', { name: tvShow.name, rating, comment });
    setRating('');
    setComment('');
    window.location.reload();
  };

  if (!tvShow) return <p>Loading...</p>;

  return (
    <div>
      <h1>{tvShow.name}</h1>
      <p><strong>Country:</strong> {tvShow.country}</p>
      <p><strong>Genre:</strong> {tvShow.genre}</p>
      <p><strong>Actors:</strong> {tvShow.actors.join(', ')}</p>
      
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
      <p>{tvShow.ratings.join(', ')}</p>

      <h3>Comments</h3>
      <p>{tvShow.comments.join(', ')}</p>
    </div>
  );
}

export default TvShowDetailPage;