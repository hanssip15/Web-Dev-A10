const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/MovieReviewTest', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Definisikan Schema dan Model untuk koleksi `movies`
const movieSchema = new mongoose.Schema({
  title: String,
  image: String,
  country: String,
  genre: [String],
  actor: [String],
  releaseYear: Number,
  synopsis: String,
  averageRating: Number,
  reviews: [
    {
      username: String,
      rating: Number,
      comment: String
    }
  ]
});

const Movie = mongoose.model('Movie', movieSchema);

// Endpoint untuk mendapatkan semua film atau berdasarkan pencarian, genre, dan negara
app.get('/api/movies', async (req, res) => {
  const { search, genre, country } = req.query;
  let query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' }; // Pencarian berdasarkan judul, tidak case-sensitive
  }

  if (genre) {
    query.genre = genre; // Filter berdasarkan genre
  }

  if (country) {
    query.country = country; // Filter berdasarkan negara
  }

  try {
    const movies = await Movie.find(query); // Cari film berdasarkan query
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movies', error: err });
  }
});

// Endpoint untuk mendapatkan detail film berdasarkan title
app.get('/api/movies/:title', async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movie', error: err });
  }
});

// Endpoint untuk menambahkan review pada film
app.post('/api/movies/rate', async (req, res) => {
  const { title, rating, comment } = req.body;
  try {
    // Cari film berdasarkan title
    const movie = await Movie.findOne({ title: title });
    
    if (movie) {
      // Tambahkan review baru ke array reviews
      const review = {
        username: 'user', // Username statis untuk saat ini
        rating: rating,
        comment: comment || '-' // Comment default jika tidak diisi
      };
      movie.reviews.push(review);

      // Hitung ulang average rating
      const totalRatings = movie.reviews.reduce((acc, review) => acc + review.rating, 0);
      movie.averageRating = totalRatings / movie.reviews.length;

      // Simpan perubahan ke database
      await movie.save();

      res.json({ success: true, message: 'Review added successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Movie not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error adding review', error: err });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});