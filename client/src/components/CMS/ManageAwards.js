import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageAwards = () => {
  const [awards, setAwards] = useState([]);
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [searchMovie, setSearchMovie] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieSuggestions, setMovieSuggestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAwardId, setEditingAwardId] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch daftar awards
  const fetchAwards = async () => {
    try {
      const response = await axios.get('/api/admin/awards', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAwards(response.data);
    } catch (error) {
      console.error('Error fetching awards:', error);
    }
  };

  // Fetch daftar film
  const fetchMovies = async (query) => {
    try {
      const response = await axios.get(`/api/movies?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredMovies = response.data.filter(
        (movie) => !selectedMovie || movie._id !== selectedMovie._id
      );
      setMovieSuggestions(filteredMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  // Mengambil data awards saat komponen dimuat
  useEffect(() => {
    fetchAwards();
  }, [token]);

  // Fungsi untuk menambah atau mengedit penghargaan
  const handleSave = async () => {
    if (!name || !year || !category || !selectedMovie) {
      alert('Please fill in all fields.');
      return;
    }

    const awardData = {
      name,
      year,
      category,
      movieId: selectedMovie._id,
    };

    try {
      if (isEditing) {
        await axios.put(`/api/admin/awards/${editingAwardId}`, awardData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Award updated successfully.');
      } else {
        await axios.post('/api/admin/awards', awardData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Award added successfully.');
      }

      setName('');
      setYear('');
      setCategory('');
      setSearchMovie('');
      setSelectedMovie(null);
      setIsEditing(false);
      setEditingAwardId(null);
      fetchAwards();
    } catch (error) {
      console.error('Failed to save award:', error);
      alert('Failed to save award. Please try again.');
    }
  };

  // Fungsi untuk memilih film
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setSearchMovie(movie.title);
    setMovieSuggestions([]);
  };

  // Fungsi untuk mencari film
  useEffect(() => {
    if (searchMovie) {
      fetchMovies(searchMovie);
    } else {
      setMovieSuggestions([]);
    }
  }, [searchMovie]);

  // Fungsi untuk membatalkan pilihan film
  const handleRemoveMovie = () => {
    setSelectedMovie(null);
    setSearchMovie('');
    setMovieSuggestions([]);
  };

  // Fungsi untuk mengedit penghargaan
  const handleEdit = (award) => {
    setName(award.name);
    setYear(award.year);
    setCategory(award.category);
    setSelectedMovie(award.movieId);
    setSearchMovie(award.movieId?.title || '');
    setIsEditing(true);
    setEditingAwardId(award._id);
  };

  // Fungsi untuk menghapus penghargaan
  const handleDelete = async (awardId) => {
    try {
      await axios.delete(`/api/admin/awards/${awardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Award deleted successfully.');
      fetchAwards();
    } catch (error) {
      console.error('Failed to delete award:', error);
      alert('Failed to delete award. Please try again.');
    }
  };

  return (
    <div>
      <h2>Manage Awards</h2>

      <div>
        <h3>{isEditing ? 'Edit Award' : 'Add Award'}</h3>
        <input
          type="text"
          placeholder="Award Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search Movie"
          value={searchMovie}
          onChange={(e) => setSearchMovie(e.target.value)}
        />
        {movieSuggestions.length > 0 && (
          <ul>
            {movieSuggestions.map((movie) => (
              <li key={movie._id}>
                {movie.title}
                <button onClick={() => handleSelectMovie(movie)}>Select</button>
              </li>
            ))}
          </ul>
        )}
        {selectedMovie && (
          <p>
            Selected Movie: <strong>{selectedMovie.title}</strong>
            <button onClick={handleRemoveMovie}>Remove</button>
          </p>
        )}
        <button onClick={handleSave}>{isEditing ? 'Update Award' : 'Add Award'}</button>
        {isEditing && <button onClick={() => setIsEditing(false)}>Cancel</button>}
      </div>

      <h3>Awards List</h3>
      <ul>
        {awards.length > 0 ? (
          awards.map((award) => (
            <li key={award._id}>
              <p>
                <strong>{award.name}</strong> ({award.year}) - {award.category}
              </p>
              <p>Movie: {award.movieId?.title || 'Unknown'}</p>
              <button onClick={() => handleEdit(award)}>Edit</button>
              <button onClick={() => handleDelete(award._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No awards found.</p>
        )}
      </ul>
    </div>
  );
};

export default ManageAwards;