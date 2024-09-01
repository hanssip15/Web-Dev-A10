const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const movies = [
  { 
    name: 'Inception', 
    image: 'inception', 
    country: 'USA', 
    actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'], 
    genre: 'Sci-Fi', 
    reviews: []
  },
  { 
    name: 'Parasite', 
    image: 'parasite', 
    country: 'South Korea', 
    actors: ['Song Kang-ho', 'Lee Sun-kyun'], 
    genre: 'Thriller', 
    reviews: [] 
  },
  { 
    name: 'Spirited Away', 
    image: 'spiritedAway', 
    country: 'Japan', 
    actors: ['Rumi Hiiragi', 'Miyu Irino'], 
    genre: 'Animation', 
    reviews: [] 
  }
];

app.get('/api/movies', (req, res) => {
  res.json(movies);
});

app.post('/api/movies/rate', (req, res) => {
  const { name, rating, comment } = req.body;
  const movie = movies.find(movie => movie.name === name);
  if (movie) {
    // Tambahkan review baru ke array reviews
    const review = {
      username: 'user', // Username statis untuk saat ini
      rating: rating,
      comment: comment || '-' // Comment default jika tidak diisi
    };
    movie.reviews.push(review);
    res.json({ success: true, message: 'Review added successfully.' });
  } else {
    res.status(404).json({ success: false, message: 'Movie not found.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});