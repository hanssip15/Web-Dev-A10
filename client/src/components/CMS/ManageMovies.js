import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbarcms';
import Header from './CMSHeader';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/admin/movies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [token]);

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
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">DataTables</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
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