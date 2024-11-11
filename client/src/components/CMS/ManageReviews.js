import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbarcms';
import Header from './CMSHeader';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.get('/api/admin/reviews', config);
      console.log("Data Reviews:", response.data); // Debug log
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const deleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      await axios.delete(`/api/admin/reviews/${reviewId}`, config);
      setReviews(reviews.filter((review) => review._id !== reviewId));
      alert('Review deleted successfully');
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
        <body id='page-top'>
            <div id='wrapper'>
                    <Navbar/>
                    <div id="content-wrapper" class="d-flex flex-column">
                        <div id='content'>
                            <Header/>
                            <div className='container-fluid'>
                                <h1 className='h3 mb-2 text-gray-800'>Manage Review</h1>
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
                                                        <th>Username</th>
                                                        <th>Movie</th>
                                                        <th>Rating</th>
                                                        <th>Review</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                  {reviews.map((review) => (
                                                  <tr key={review._id}>
                                                    <td>{review.userId.username}</td>
                                                    <td>{review.movieId.title}</td>
                                                    <td>{review.rating}</td>
                                                    <td>{review.reviewText}</td>
                                                    <td><button onClick={() => deleteReview(review._id)}>Delete</button></td>
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

export default ManageReviews;