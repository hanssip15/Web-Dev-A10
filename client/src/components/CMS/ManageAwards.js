import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbarcms';
import Header from './CMSHeader';

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
        <body id='page-top'>
            <div id='wrapper'>
                    <Navbar/>
                    <div id="content-wrapper" class="d-flex flex-column">
                        <div id='content'>
                            <Header/>
                            <div className='container-fluid'>
                                <h1 className='h3 mb-2 text-gray-800'>Manage Awards</h1>
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">DataTables</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                        <div class="dataTables_length" id="dataTable_length">
                                          <label>
                                            Show Entries<select name="dataTable_length" aria-controls="dataTable" class="custom-select custom-select-sm form-control form-control-sm">
                                              <option value="5">5</option><option value="25">25</option><option value="50">50</option><option value="100">100</option>
                                              </select> 
                                          </label>
                                        </div>
                                            <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Award Name</th>
                                                        <th>Year</th>
                                                        <th>Category</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {awards.map(award => (
                                                  <tr key={award._id}>
                                                    <td>{award.title}</td>
                                                    <td>{award.releaseYear}</td>
                                                    <td>{award.category}</td>
                                                    <td><button onClick={() => handleEdit(award._id)}> Edit</button><button onClick={() => handleSave(award._id)}> Edit</button><button onClick={() => handleDelete(award._id)}> Delete</button></td>
                                                  </tr>
                                                ))} 
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </body>
    </div>
  );
};

export default ManageAwards;