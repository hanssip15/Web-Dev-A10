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
  suspendUntil: { type: Date, default: null },
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
  averageRating: Number,
  awards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Award' }]
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
  genre: [{ type: String }], // Bisa array jika ada beberapa genre
  year: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestDate: { type: Date, default: Date.now }
});
const MovieRequest = mongoose.model('MovieRequest', movieRequestSchema);

// Award Schema
const awardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true }
});
const Award = mongoose.model('Award', awardSchema);

// Middleware untuk autentikasi token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], 'secretkey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // Menyimpan user di request
    next();
  });
};

// Middleware untuk memeriksa apakah user sedang disuspend
const checkUserSuspension = async (req, res, next) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      // Jika pengguna tidak ditemukan
      return res.status(400).json({ message: 'Username atau password salah.' });
    }

    // Cek apakah user sedang disuspend
    if (user.suspendUntil && new Date() < new Date(user.suspendUntil)) {
      const suspendEnd = new Date(user.suspendUntil).toLocaleString();
      const timeLeft = Math.ceil((new Date(user.suspendUntil) - new Date()) / (1000 * 60)); // Waktu tersisa dalam menit
      return res.status(403).json({
        message: `Akun tersebut sedang disuspend sampai: ${suspendEnd}. Silakan coba lagi dalam ${timeLeft} menit.`,
      });
    }

    // Lanjutkan jika user tidak disuspend
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking user suspension', error });
  }
};

// Middleware untuk memeriksa role admin
const authenticateAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') { // Pastikan `role` disimpan dalam token
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Endpoint untuk admin melihat semua request movie dengan status 'pending'
app.post('/api/movie-requests', authenticateToken, async (req, res) => {
  const { title, description, genre, year } = req.body;

  try {
    const newRequest = new MovieRequest({
      title,
      description,
      genre,
      year,
      userId: req.user.userId // Mengambil userId dari token
    });

    // Menyimpan request ke database
    await newRequest.save();

    res.status(201).json({ message: 'Movie request submitted successfully!' });
  } catch (err) {
    console.error('Failed to submit movie request:', err); // Log detail error
    res.status(500).json({ message: 'Failed to submit movie request', error: err });
  }
});

app.get('/api/movie-requests', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const requests = await MovieRequest.find({ status: 'pending' }).populate('userId', 'username name');
    res.json(requests);
  } catch (err) {
    console.error('Error fetching movie requests:', err);
    res.status(500).json({ message: 'Error fetching movie requests', error: err });
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
    const movie = await Movie.findOne({ title: req.params.title })
      .populate('country', 'name')     // Mem-populate country hanya dengan nama
      .populate('genre', 'name')       // Mem-populate genre hanya dengan nama
      .populate('actor', 'name')       // Mem-populate actor hanya dengan nama
      .populate('awards', 'name year category'); // Mem-populate awards dengan field yang relevan

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

// Endpoint untuk mengedit detail film
app.put('/api/admin/movies/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  const { title, country, genre, actor, releaseYear, synopsis } = req.body;

  try {
    // Validasi aktor: Pastikan aktor yang dimasukkan ada dalam database
    const existingActors = await Actor.find();
    const validActorIds = existingActors.map(a => a._id.toString());
    const invalidActors = actor.filter(id => !validActorIds.includes(id));

    // Jika ada aktor yang tidak valid, kirim respons dengan daftar aktor yang tidak ditemukan
    if (invalidActors.length > 0) {
      return res.status(400).json({
        message: 'Some actors do not exist in the database',
        invalidActors
      });
    }

    // Update film dengan data yang sudah divalidasi
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, country, genre, actor, releaseYear, synopsis },
      { new: true }
    )
      .populate('country', 'name')
      .populate('genre', 'name')
      .populate('actor', 'name');

    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update movie', error });
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

// Endpoint untuk mendapatkan semua aktor
app.get('/api/actors', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const actors = await Actor.find();
    res.json(actors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch actors', error });
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

// Endpoint login dengan pengecekan suspend user
app.post('/api/login', checkUserSuspension, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // Buat token JWT dengan menyertakan role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'secretkey',
      { expiresIn: '1h' }
    );

    // Kirimkan token dan role ke frontend
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Endpoint khusus admin untuk mendapatkan semua data film
app.get('/api/admin/movies', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const movies = await Movie.find()
      .populate('country', 'name')
      .populate('genre', 'name')
      .populate('actor', 'name');

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies', error });
  }
});

// Endpoint untuk statistik CMS
app.get('/api/admin/stats', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const pendingRequests = await MovieRequest.countDocuments({ status: 'pending' });

    res.json({ totalMovies, totalUsers, totalReviews, pendingRequests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error });
  }
});

// Endpoint untuk mendapatkan semua review dengan populasi userId dan movieId
app.get('/api/admin/reviews', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'username') // Populate username dari user
      .populate('movieId', 'title');  // Populate title dari movie
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error); // Log error untuk debugging
    res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
});

// Endpoint untuk menghapus review berdasarkan ID
app.delete('/api/admin/reviews/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error); // Log error untuk debugging
    res.status(500).json({ message: 'Failed to delete review', error });
  }
});

// Endpoint untuk mendapatkan daftar user (kecuali user yang sedang login)
app.get('/api/admin/users', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const currentUser = await User.findById(currentUserId).select('name username _id');
    const users = await User.find({ _id: { $ne: currentUserId } }).select('-password');
    res.json({ currentUser, users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
});

// Endpoint untuk menghapus akun user berdasarkan ID
app.delete('/api/admin/users/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user.userId;

    // Cegah admin menghapus akun yang sedang digunakan
    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot delete the currently logged-in account." });
    }

    // Hapus user dari database
    const deletedUser = await User.findByIdAndDelete(userId);

    // Jika user tidak ditemukan
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error });
  }
});

// Suspend User
app.put('/api/admin/users/:id/suspend', authenticateToken, authenticateAdmin, async (req, res) => {
  const { duration } = req.body;
  const suspendDurations = {
    '1h': 1,
    '3h': 3,
    '6h': 6,
    '12h': 12,
    '1d': 24,
    '2d': 48,
    '3d': 72,
  };

  if (!suspendDurations[duration]) {
    return res.status(400).json({ message: 'Invalid suspension duration' });
  }

  const suspendUntil = new Date();
  suspendUntil.setHours(suspendUntil.getHours() + suspendDurations[duration]);

  try {
    await User.findByIdAndUpdate(req.params.id, { suspendUntil });
    res.json({ message: `User suspended for ${duration}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to suspend user', error });
  }
});

// Unsuspend User
app.put('/api/admin/users/:id/unsuspend', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { suspendUntil: null });
    res.json({ message: 'User unsuspended successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unsuspend user', error });
  }
});

// Endpoint untuk mendapatkan semua aktor
app.get('/api/admin/actors', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const actors = await Actor.find();
    res.json(actors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch actors', error });
  }
});

// Endpoint untuk menambahkan aktor baru
app.post('/api/admin/actors', authenticateToken, authenticateAdmin, async (req, res) => {
  const { name } = req.body;
  try {
    const newActor = new Actor({ name });
    await newActor.save();
    res.status(201).json({ message: 'Actor added successfully', actor: newActor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add actor', error });
  }
});

// Endpoint untuk memperbarui aktor berdasarkan ID
app.put('/api/admin/actors/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  const { name } = req.body;
  try {
    const updatedActor = await Actor.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.json({ message: 'Actor updated successfully', actor: updatedActor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update actor', error });
  }
});

// Endpoint untuk menghapus aktor berdasarkan ID
app.delete('/api/admin/actors/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    await Actor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Actor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete actor', error });
  }
});

/// Endpoint untuk menambahkan penghargaan baru
app.post('/api/admin/awards', authenticateToken, authenticateAdmin, async (req, res) => {
  const { name, year, category, movieId } = req.body;

  // Validasi input
  if (!name || !year || !category || !movieId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newAward = new Award({ name, year, category, movieId });
    await newAward.save();

    // Update movie dengan menambahkan award
    await Movie.findByIdAndUpdate(movieId, { $push: { awards: newAward._id } });

    res.status(201).json(newAward);
  } catch (error) {
    console.error('Failed to create award:', error);
    res.status(500).json({ message: 'Failed to create award', error });
  }
});

// Endpoint untuk mendapatkan semua penghargaan
app.get('/api/admin/awards', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const awards = await Award.find().populate('movieId', 'title');
    res.json(awards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch awards', error });
  }
});

// Endpoint untuk mengupdate penghargaan
app.put('/api/admin/awards/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  const { name, year, category, movieId } = req.body;

  try {
    const existingAward = await Award.findById(req.params.id);
    const oldMovieId = existingAward.movieId.toString();

    // Perbarui penghargaan
    const updatedAward = await Award.findByIdAndUpdate(
      req.params.id,
      { name, year, category, movieId },
      { new: true }
    ).populate('movieId', 'title');

    // Jika movieId diubah, perbarui koleksi film
    if (oldMovieId !== movieId) {
      await Movie.findByIdAndUpdate(oldMovieId, { $pull: { awards: req.params.id } });
      await Movie.findByIdAndUpdate(movieId, { $push: { awards: req.params.id } });
    }

    res.json(updatedAward);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update award', error });
  }
});

// Endpoint untuk menghapus penghargaan
app.delete('/api/admin/awards/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const awardId = req.params.id;
    const award = await Award.findByIdAndDelete(awardId);

    // Hapus penghargaan dari koleksi film yang terkait
    if (award) {
      await Movie.findByIdAndUpdate(award.movieId, { $pull: { awards: awardId } });
    }

    res.json({ message: 'Award deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete award', error });
  }
});

// ** Jalankan server **
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});