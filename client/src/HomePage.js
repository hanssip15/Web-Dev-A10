import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MHeader from './components/MHeader.js';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await axios.get('/api/movies');
        console.log('Movies data in HomePage:', movieRes.data);
        setMovies(movieRes.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchData();
  }, []);  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  useEffect(() => {
    console.log(movies); // Ini akan membantu melihat apakah data `country`, `genre`, dan `actor` benar-benar ada
  }, [movies]);  

  return (
    <div>
      <MHeader />
      <div className="image-container">
        {movies.length > 0 && (
          <>
            <img
              src={movies[currentMovieIndex].image}
              alt={movies[currentMovieIndex].title}
              className="styled-image"
            />
            <div className="movie-details">
              <h2>{movies[currentMovieIndex].title}</h2>
              <p>{movies[currentMovieIndex].synopsis}</p>
              <p>Country: {movies[currentMovieIndex].country ? movies[currentMovieIndex].country.name : 'Unknown'}</p>
              <p>Genre: {movies[currentMovieIndex].genre && movies[currentMovieIndex].genre.length > 0 ? movies[currentMovieIndex].genre.map(g => g.name).join(', ') : 'N/A'}</p>
              <p>Actors: {movies[currentMovieIndex].actor && movies[currentMovieIndex].actor.length > 0 ? movies[currentMovieIndex].actor.map(a => a.name).join(', ') : 'Unknown'}</p>
              <Link to={`/movie/${encodeURIComponent(movies[currentMovieIndex].title)}`} className="moreButton">More Details</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;