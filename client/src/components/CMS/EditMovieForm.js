import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditMovieForm = ({ movie, onClose, onSave }) => {
  const [title, setTitle] = useState(movie.title);
  const [releaseYear, setReleaseYear] = useState(movie.releaseYear);
  const [synopsis, setSynopsis] = useState(movie.synopsis);
  const [selectedActors, setSelectedActors] = useState(movie.actor);
  const [actorOptions, setActorOptions] = useState([]);
  const [searchActor, setSearchActor] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch daftar aktor
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await axios.get('/api/actors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActorOptions(response.data);
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    fetchActors();
  }, [token]);

  // Cari rekomendasi aktor
  useEffect(() => {
    if (searchActor) {
      // Filter aktor yang belum ada di film
      const existingActorIds = selectedActors.map((a) => a._id);
      const matches = actorOptions.filter(
        (actor) =>
          actor.name.toLowerCase().includes(searchActor.toLowerCase()) &&
          !existingActorIds.includes(actor._id)
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchActor, actorOptions, selectedActors]);

  // Fungsi untuk menyimpan perubahan film
  const handleSave = async () => {
    try {
      const updatedMovie = {
        title,
        releaseYear,
        synopsis,
        actor: selectedActors.map((a) => a._id),
      };

      await axios.put(`/api/admin/movies/${movie._id}`, updatedMovie, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
    } catch (error) {
      console.error('Failed to update movie:', error);
      alert('Failed to update movie details. Please try again.');
    }
  };

  // Fungsi untuk menambah aktor yang sudah dicari
  const handleAddActor = (actor) => {
    if (!selectedActors.find((a) => a._id === actor._id)) {
      setSelectedActors([...selectedActors, actor]);
    }
    setSearchActor('');
    setSuggestions([]);
  };

  // Fungsi untuk menghapus aktor dari daftar film
  const handleRemoveActor = (actorId) => {
    setSelectedActors(selectedActors.filter((a) => a._id !== actorId));
  };

  return (
    <div>
      <h3>Edit Movie: {movie.title}</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="number"
        value={releaseYear}
        onChange={(e) => setReleaseYear(e.target.value)}
        placeholder="Release Year"
      />
      <textarea
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
        placeholder="Synopsis"
      />

      <h4>Actors</h4>
      <input
        type="text"
        value={searchActor}
        onChange={(e) => setSearchActor(e.target.value)}
        placeholder="Search actor"
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((actor) => (
            <li key={actor._id}>
              {actor.name}{' '}
              <button onClick={() => handleAddActor(actor)}>Add Actor</button>
            </li>
          ))}
        </ul>
      )}
      <ul>
        {selectedActors.map((actor) => (
          <li key={actor._id}>
            {actor.name}{' '}
            <button onClick={() => handleRemoveActor(actor._id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EditMovieForm;