const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const movies = [
  { name: 'Inception', country: 'USA', actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'], genre: 'Sci-Fi', ratings: [], comments: [] },
  { name: 'Parasite', country: 'South Korea', actors: ['Song Kang-ho', 'Lee Sun-kyun'], genre: 'Thriller', ratings: [], comments: [] },
  { name: 'Spirited Away', country: 'Japan', actors: ['Rumi Hiiragi', 'Miyu Irino'], genre: 'Animation', ratings: [], comments: [] }
];

const tvShows = [
  { name: 'Breaking Bad', country: 'USA', actors: ['Bryan Cranston', 'Aaron Paul'], genre: 'Crime', ratings: [], comments: [] },
  { name: 'Dark', country: 'Germany', actors: ['Louis Hofmann', 'Lisa Vicari'], genre: 'Sci-Fi', ratings: [], comments: [] },
  { name: 'Money Heist', country: 'Spain', actors: ['Álvaro Morte', 'Úrsula Corberó'], genre: 'Crime', ratings: [], comments: [] }
];

app.get('/api/movies', (req, res) => {
  res.json(movies);
});

app.get('/api/tvshows', (req, res) => {
  res.json(tvShows);
});

app.post('/api/movies/rate', (req, res) => {
  const { name, rating, comment } = req.body;
  const movie = movies.find(movie => movie.name === name);
  if (movie) {
    if (rating) movie.ratings.push(rating);
    if (comment) movie.comments.push(comment);
    res.json({ success: true, message: 'Rating and/or comment added successfully.' });
  } else {
    res.status(404).json({ success: false, message: 'Movie not found.' });
  }
});

app.post('/api/tvshows/rate', (req, res) => {
  const { name, rating, comment } = req.body;
  const tvShow = tvShows.find(show => show.name === name);
  if (tvShow) {
    if (rating) tvShow.ratings.push(rating);
    if (comment) tvShow.comments.push(comment);
    res.json({ success: true, message: 'Rating and/or comment added successfully.' });
  } else {
    res.status(404).json({ success: false, message: 'TV Show not found.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});