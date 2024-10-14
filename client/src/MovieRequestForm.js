import React, { useState } from 'react';
import axios from 'axios';

function MovieRequestForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    year: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post('/api/movie-requests', formData, config);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error submitting movie request', error);
      setMessage('Failed to submit request');
    }
  };

  return (
    <div>
      <h1>Request a New Movie</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </label>
        <label>
          Description:
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
        </label>
        <label>
          Genre (comma separated):
          <input
            type="text"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value.split(',') })}
          />
        </label>
        <label>
          Release Year:
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default MovieRequestForm;