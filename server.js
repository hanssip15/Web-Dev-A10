// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/MovieReviewTest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// ** Schemas dan Models **

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});
const User = mongoose.model('User', userSchema);

// Actor Schema
const actorSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Actor = mongoose.model('Actor', actorSchema);

// Country Schema
const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Country = mongoose.model('Country', countrySchema);

// Genre Schema
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Genre = mongoose.model('Genre', genreSchema);

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: String,
  image: String,
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
  actor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
  releaseYear: Number,
  synopsis: String,
  averageRating: Number
});
const Movie = mongoose.model('Movie', movieSchema);

// Review Schema
const reviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

// Movie Request Schema
const movieRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
  year: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestDate: { type: Date, default: Date.now },
});
const MovieRequest = mongoose.model('MovieRequest', movieRequestSchema);

// ** Middleware untuk autentikasi admin dan user **
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], 'secretkey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Endpoint untuk admin melihat semua request movie dengan status 'pending'
app.get('/api/movie-requests', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const requests = await MovieRequest.find({ status: 'pending' }).populate('userId', 'username name');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movie requests', error: err });
  }
});

// ** Endpoint untuk permintaan film baru (user yang login) **
app.post('/api/movie-requests', authenticateToken, async (req, res) => {
  const { title, description, genre, year } = req.body;

  try {
    const newRequest = new MovieRequest({
      title,
      description,
      genre,
      year,
      userId: req.user.userId,
    });
    await newRequest.save();
    res.status(201).json({ message: 'Movie request submitted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit movie request', error: err });
  }
});

// ** Endpoint untuk admin menyetujui atau menolak request film, dan menambahkan film ke database **
app.put('/api/movie-requests/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  const { status, title, country, genre, actor, releaseYear, synopsis } = req.body;

  try {
    const request = await MovieRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Movie request not found' });

    if (status === 'approved') {
      const newMovie = new Movie({
        title: title || request.title,
        country,
        genre,
        actor,
        releaseYear: releaseYear || null,
        synopsis: synopsis || request.description,
        averageRating: 0,
        reviews: [],
      });
      await newMovie.save();
    }

    request.status = status;
    await request.save();
    res.json({ message: `Movie request ${status} successfully.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update movie request', error: err });
  }
});

// ** Routes untuk Film **
// Endpoint untuk mendapatkan semua film atau berdasarkan pencarian, genre, dan negara
app.get('/api/movies', async (req, res) => {
  const { search, genre, country } = req.query;
  let query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (genre) {
    query.genre = genre;
  }

  if (country) {
    query.country = country;
  }

  try {
    const movies = await Movie.find(query)
      .populate('country', 'name')   // Memastikan populate country dengan field 'name'
      .populate('genre', 'name')     // Memastikan populate genre dengan field 'name'
      .populate('actor', 'name');    // Memastikan populate actor dengan field 'name'
    
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movies', error: err });
  }
});

// Endpoint untuk mendapatkan detail film berdasarkan title
app.get('/api/movies/:title', async (req, res) => {
  try {
    // Temukan film berdasarkan judul dan populasi country, genre, dan actor
    const movie = await Movie.findOne({ title: req.params.title })
      .populate('country', 'name')     // Mem-populate country hanya dengan nama
      .populate('genre', 'name')       // Mem-populate genre hanya dengan nama
      .populate('actor', 'name');      // Mem-populate actor hanya dengan nama

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Ambil semua review terkait film tersebut dari koleksi `Review`
    const reviews = await Review.find({ movieId: movie._id }).populate('userId', 'name');

    // Gabungkan movie dengan reviews untuk dikirim sebagai respons
    res.json({ ...movie.toObject(), reviews });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movie details', error: err });
  }
});

app.post('/api/movies/rate', authenticateToken, async (req, res) => {
  const { title, rating, reviewText } = req.body;

  try {
    const movie = await Movie.findOne({ title });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Buat review baru di koleksi `Review`
    const review = new Review({
      movieId: movie._id,
      userId: req.user.userId,
      rating: rating,
      reviewText: reviewText
    });
    await review.save();

    // Hitung ulang rata-rata rating
    const reviews = await Review.find({ movieId: movie._id });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1); // Menghitung rata-rata dan membatasi 1 desimal

    // Update `averageRating` di dokumen `Movie`
    movie.averageRating = parseFloat(averageRating); // Mengubah string menjadi float
    await movie.save();

    res.json({ success: true, message: 'Review added successfully!' });
  } catch (err) {
    console.error("Error in adding review:", err);
    res.status(500).json({ message: 'Failed to add review', error: err });
  }
});

// Endpoint untuk mendapatkan semua countries
app.get('/api/countries', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching countries', error: err });
  }
});

// Endpoint untuk mendapatkan semua genres
app.get('/api/genres', async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching genres', error: err });
  }
});

// Endpoint untuk mendapatkan semua actors
app.get('/api/actors', async (req, res) => {
  try {
    const actors = await Actor.find();
    res.json(actors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching actors', error: err });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, username, password } = req.body;

  try {
    // Enkripsi password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat pengguna baru
    const newUser = new User({ name, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(400).json({ message: 'Failed to register user', error: err });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari pengguna berdasarkan username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // Buat token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, name: user.name, role: user.role },
      'secretkey', // Ganti dengan kunci rahasia yang aman
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// ** Jalankan server **
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});