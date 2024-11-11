// ManageMovies.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbarcms';
import Header from './CMSHeader';
import EditMovieForm from './EditMovieForm';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch daftar film dari backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/admin/movies', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [token]);

  // Fungsi untuk mengedit film
  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
  };

  // Fungsi untuk menyimpan perubahan
  const handleSave = () => {
    setSelectedMovie(null);
    window.location.reload();
  };

  // Fungsi untuk menghapus film
  const handleDeleteMovie = async (movieId) => {
    try {
      await axios.delete(`/api/admin/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(movies.filter((movie) => movie._id !== movieId));
      alert('Movie deleted successfully');
    } catch (error) {
      console.error('Failed to delete movie:', error);
      alert('Failed to delete movie. Please try again.');
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
                                <h1 className='h3 mb-2 text-gray-800'>Manage Movie</h1>
                                {selectedMovie && (
                                  <EditMovieForm
                                    movie={selectedMovie}
                                    onClose={() => setSelectedMovie(null)}
                                    onSave={handleSave}
                                  />
                                )}
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
                                                        <th>Movie Name</th>
                                                        <th>Country</th>
                                                        <th>Genre</th>
                                                        <th>Actors</th>
                                                        <th>Release Year</th>
                                                        <th>Average Rating</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {movies.map(movie => (
                                                  <tr key={movie._id}>
                                                    <td>{movie.title}</td>
                                                    <td>{movie.country?.name || "Unknown"}</td>
                                                    <td>{movie.genre.map(g => g.name).join(", ")}</td>
                                                    <td>{movie.actor.map(a => a.name).join(", ")}</td>
                                                    <td>{movie.releaseYear}</td>
                                                    <td>{movie.averageRating}</td>
                                                    <td>
                                                      <button onClick={() => handleEditMovie(movie)}>Edit</button>
                                                      <button onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
                                                    </td>
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

export default ManageMovies;