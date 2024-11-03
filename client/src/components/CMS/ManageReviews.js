import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      <h2>Manage Reviews</h2>
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <li key={review._id}>
              <p><strong>User:</strong> {review.userId.username}</p>
              <p><strong>Movie:</strong> {review.movieId.title}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Review:</strong> {review.reviewText}</p>
              <button onClick={() => deleteReview(review._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </ul>
    </div>
  );
};

export default ManageReviews;