import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MovieRequestAdmin() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatedMovie, setUpdatedMovie] = useState({
    title: '',
    country: '',
    genre: [],
    actor: [],
    releaseYear: '',
    synopsis: ''
  });
  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get('/api/movie-requests', config);
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching movie requests', error);
      }
    };

    const fetchMetadata = async () => {
      try {
        const [countriesRes, genresRes, actorsRes] = await Promise.all([
          axios.get('/api/countries'), // Assumes `/api/countries` endpoint exists
          axios.get('/api/genres'), // Assumes `/api/genres` endpoint exists
          axios.get('/api/actors') // Assumes `/api/actors` endpoint exists
        ]);
        setCountries(countriesRes.data);
        setGenres(genresRes.data);
        setActors(actorsRes.data);
      } catch (error) {
        console.error('Error fetching metadata', error);
      }
    };

    fetchRequests();
    fetchMetadata();
  }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.put(`/api/movie-requests/${id}`, {
        status: 'approved',
        ...updatedMovie,
      }, config);

      alert('Movie approved and added successfully!');
      setRequests(requests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error approving movie request', error);
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.put(`/api/movie-requests/${id}`, { status: 'rejected' }, config);
      alert('Movie request rejected.');
      setRequests(requests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error rejecting movie request', error);
    }
  };

  return (
    <div>
      <h1>Manage Movie Requests</h1>
      {requests.length > 0 ? (
        requests.map((request) => (
          <div key={request._id}>
            <h3>{request.title}</h3>
            <p>{request.description}</p>
            <button onClick={() => setSelectedRequest(request)}>Approve</button>
            <button onClick={() => handleReject(request._id)}>Reject</button>
          </div>
        ))
      ) : (
        <p>No movie requests pending.</p>
      )}

      {selectedRequest && (
        <div>
          <h2>Approve Movie Request</h2>
          <label>
            Title:
            <input
              type="text"
              value={updatedMovie.title}
              onChange={(e) => setUpdatedMovie({ ...updatedMovie, title: e.target.value })}
              placeholder={selectedRequest.title}
            />
          </label>
          <label>
            Country:
            <select
              value={updatedMovie.country}
              onChange={(e) => setUpdatedMovie({ ...updatedMovie, country: e.target.value })}
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country._id} value={country._id}>{country.name}</option>
              ))}
            </select>
          </label>
          <label>
            Genre:
            <select
              multiple
              value={updatedMovie.genre}
              onChange={(e) => setUpdatedMovie({ ...updatedMovie, genre: Array.from(e.target.selectedOptions, option => option.value) })}
            >
              {genres.map(genre => (
                <option key={genre._id} value={genre._id}>{genre.name}</option>
              ))}
            </select>
          </label>
          <label>
            Actor:
            <select
              multiple
              value={updatedMovie.actor}
              onChange={(e) => setUpdatedMovie({ ...updatedMovie, actor: Array.from(e.target.selectedOptions, option => option.value) })}
            >
              {actors.map(actor => (
                <option key={actor._id} value={actor._id}>{actor.name}</option>
              ))}
            </select>
          </label>
          <label>
            Release Year:
            <input
              type="number"
              value={updatedMovie.releaseYear}
              onChange={(e) => setUpdatedMovie({ ...updatedMovie, releaseYear: e.target.value })}
            />
          </label>
          <label>
            Synopsis:
            <textarea
              value={updatedMovie.synopsis}
              onChange={(e) => setUpdatedMovie({ ...updatedMovie, synopsis: e.target.value })}
            ></textarea>
          </label>
          <button onClick={() => handleApprove(selectedRequest._id)}>Submit Approval</button>
        </div>
      )}
    </div>
  );
}

export default MovieRequestAdmin;