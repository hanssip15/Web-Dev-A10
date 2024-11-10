// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './sb-admin-2.css';
import Navbar from './navbarcms';
import Header from './CMSHeader';

const Dashboard = () => {
  const [adminData, setAdminData] = useState(null);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.get('/api/admin/stats', config);
      setAdminData(response.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      alert('Access denied or invalid token');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (!adminData) return <p>Loading...</p>;

  return (
    <div>
      <body id='page-top'>
                <div id='wrapper'>
                    <Navbar/>
                    <div id="content-wrapper" class="d-flex flex-column">
                        <div id='content'>
                            <Header/>
                            <div className='container-fluid'>
                                <div className='d-sm-flex align-items-center justify-content-between mb-4'>
                                    <h1 className='h3 mb-2 text-gray-800'>Admin Dashboard</h1>
                                </div>
                                <div className="row">
                                  <div className="col-xl-3 col-md-6 mb-4">
                                      <div className="card border-left-primary shadow h-100 py-2">
                                          <div className="card-body">
                                              <div className="row no-gutters align-items-center">
                                                  <div className="col mr-2">
                                                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                          Jumlah Film</div>
                                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{adminData.totalMovies}</div>
                                                  </div>
                                                  <div className="col-auto">
                                                      <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-xl-3 col-md-6 mb-4">
                                      <div className="card border-left-success shadow h-100 py-2">
                                          <div className="card-body">
                                              <div className="row no-gutters align-items-center">
                                                  <div className="col mr-2">
                                                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                          Jumlah User</div>
                                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{adminData.totalUsers}</div>
                                                  </div>
                                                  <div className="col-auto">
                                                      <i className="fas fa-calendar fa-2x text-gray-300"></i>                                                    </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-xl-3 col-md-6 mb-4"> 
                                      <div className="card border-left-info shadow h-100 py-2">
                                          <div className="card-body">
                                              <div className="row no-gutters align-items-center">
                                                  <div className="col mr-2">
                                                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Jumlah Request Film
                                                      </div>
                                                      <div className="row no-gutters align-items-center">
                                                          <div className="col-auto">
                                                              <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{adminData.pendingRequests}</div>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="col-auto">
                                                      <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-xl-3 col-md-6 mb-4">
                                      <div className="card border-left-warning shadow h-100 py-2">
                                          <div className="card-body">
                                              <div className="row no-gutters align-items-center">
                                                  <div className="col mr-2">
                                                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                          Jumlah Review</div>
                                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{adminData.totalReviews}</div>
                                                  </div>
                                                  <div className="col-auto">
                                                      <i className="fas fa-comments fa-2x text-gray-300"></i>
                                                  </div>
                                              </div>
                                          </div>
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

export default Dashboard;