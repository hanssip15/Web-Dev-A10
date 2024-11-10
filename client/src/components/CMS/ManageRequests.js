import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbarcms';
import Header from './CMSHeader';

function ManageRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      const response = await axios.get('/api/movie-requests', config);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching movie requests:', error);
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.put(`/api/movie-requests/${id}`, { status: 'approved' }, config);
      setRequests(requests.filter(request => request._id !== id));
      alert('Movie request approved');
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.put(`/api/movie-requests/${id}`, { status: 'rejected' }, config);
      setRequests(requests.filter(request => request._id !== id));
      alert('Movie request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
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
                                <h1 className='h3 mb-2 text-gray-800'>Manage Request</h1>
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
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {requests.map(request => (
                                                  <tr key={request._id}>
                                                    <td>{request.title}</td>
                                                    <td><button onClick={() => handleApprove(request._id)}>Approve</button> <button onClick={() => handleReject(request._id)}>Reject</button> </td>
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
}

export default ManageRequests;