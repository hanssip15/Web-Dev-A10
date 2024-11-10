import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageActors = () => {
  const [actors, setActors] = useState([]); // Menyimpan daftar aktor
  const [newActorName, setNewActorName] = useState(''); // Menyimpan input nama aktor baru
  const [editingActor, setEditingActor] = useState(null); // Menyimpan ID aktor yang sedang diedit
  const [editingName, setEditingName] = useState(''); // Menyimpan input nama yang sedang diedit
  const token = localStorage.getItem('token');

  // Fungsi untuk mengambil daftar aktor dari server
  const fetchActors = async () => {
    try {
      const response = await axios.get('/api/admin/actors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActors(response.data);
    } catch (error) {
      console.error('Failed to fetch actors:', error);
      alert('Failed to fetch actors. Please try again later.');
    }
  };

  // Fungsi untuk menambahkan aktor baru
  const addActor = async () => {
    if (newActorName.trim() === '') {
      alert('Actor name cannot be empty.');
      return;
    }

    try {
      await axios.post('/api/admin/actors', { name: newActorName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewActorName(''); // Reset input
      fetchActors(); // Ambil ulang daftar aktor
      alert('Actor added successfully');
    } catch (error) {
      console.error('Failed to add actor:', error);
      alert('Failed to add actor. Please try again.');
    }
  };

  // Fungsi untuk memperbarui nama aktor
  const updateActor = async (actorId) => {
    if (editingName.trim() === '') {
      alert('Actor name cannot be empty.');
      return;
    }

    try {
      await axios.put(`/api/admin/actors/${actorId}`, { name: editingName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingActor(null);
      setEditingName('');
      fetchActors();
      alert('Actor updated successfully');
    } catch (error) {
      console.error('Failed to update actor:', error);
      alert('Failed to update actor. Please try again.');
    }
  };

  // Fungsi untuk menghapus aktor
  const deleteActor = async (actorId) => {
    if (!window.confirm('Are you sure you want to delete this actor?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/actors/${actorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchActors();
      alert('Actor deleted successfully');
    } catch (error) {
      console.error('Failed to delete actor:', error);
      alert('Failed to delete actor. Please try again.');
    }
  };

  // Mengambil daftar aktor saat komponen dimuat
  useEffect(() => {
    fetchActors();
  }, []);

  return (
    <div>
      <h2>Manage Actors</h2>

      {/* Form untuk menambahkan aktor baru */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Add New Actor</h3>
        <input
          type="text"
          placeholder="Enter actor name"
          value={newActorName}
          onChange={(e) => setNewActorName(e.target.value)}
        />
        <button onClick={addActor}>Add Actor</button>
      </div>

      {/* Daftar aktor */}
      <h3>List of Actors</h3>
      {actors.length > 0 ? (
        <ul>
          {actors.map((actor) => (
            <li key={actor._id} style={{ marginBottom: '10px' }}>
              {editingActor === actor._id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button onClick={() => updateActor(actor._id)}>Save</button>
                  <button onClick={() => setEditingActor(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{actor.name}</span>
                  <button onClick={() => {
                    setEditingActor(actor._id);
                    setEditingName(actor.name);
                  }}>Edit</button>
                  <button onClick={() => deleteActor(actor._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No actors found.</p>
      )}
    </div>
  );
};

export default ManageActors;