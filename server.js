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
  useUnifiedTopology: true
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

// Movie Schema
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
      name: String, // Ditambahkan 'name' pada review schema
      rating: Number,
      comment: String,
    },
  ],
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

// ** Routes untuk Film **

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
app.post('/api/movies/rate', authenticateToken, async (req, res) => {
  const { title, rating, reviewText } = req.body;

  try {
    // Cari movie berdasarkan title
    const movie = await Movie.findOne({ title: title });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

    // Buat review baru dan simpan di collection `reviews`
    const review = new Review({
      movieId: movie._id,
      userId: req.user.userId, // Ambil userId dari token JWT
      rating: rating,
      reviewText: reviewText
    });

    await review.save();

    // Populate user information to return the review with user details
    const populatedReview = await Review.findById(review._id).populate('userId', 'username name');

    res.json({ success: true, review: populatedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error adding review', error: err });
  }
});

// Endpoint untuk mendapatkan semua review berdasarkan movieId
app.get('/api/movies/:title/reviews', async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const reviews = await Review.find({ movieId: movie._id }).populate('userId', 'username name');

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err });
  }
});

// ** Routes untuk Login dan Registrasi **

// Register route
app.post('/api/register', async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to register user', error: err });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { userId: user._id, username: user.username, name: user.name },
      'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// Menambahkan admin oleh admin lain
app.post('/api/add-admin', authenticateToken, async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ username, password: hashedPassword, role: 'admin' });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin added successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add admin', error: err });
  }
});

// ** Jalankan server **
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});