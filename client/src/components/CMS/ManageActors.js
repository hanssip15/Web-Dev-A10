import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbarcms';
import Header from './CMSHeader';

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
        <body id='page-top'>
            <div id='wrapper'>
                    <Navbar/>
                    <div id="content-wrapper" class="d-flex flex-column">
                        <div id='content'>
                            <Header/>
                            <div className='container-fluid'>
                                <h1 className='h3 mb-2 text-gray-800'>Manage Actors</h1>
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
                                                        <th>Actor Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                
                                                {actors.map((actor) => (
                                                  <tr key={actor._id}>
                                                  {editingActor === actor._id ? (
                                                    <>
                                                      <td>
                                                      <input
                                                        type="text"
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                      />
                                                      </td>
                                                      <td>
                                                        <button onClick={() => updateActor(actor._id)}>Save</button>
                                                        <button onClick={() => setEditingActor(null)}>Cancel</button>
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <td>{actor.name}</td>
                                                      <td>
                                                        <button onClick={() => {
                                                          setEditingActor(actor._id);
                                                          setEditingName(actor.name);
                                                        }}>Edit</button>
                                                        <button onClick={() => deleteActor(actor._id)}>Delete</button>
                                                      </td>
                                                    </>
                                                  )}
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

export default ManageActors;