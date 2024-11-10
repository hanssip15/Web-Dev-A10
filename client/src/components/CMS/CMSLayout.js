import React, { useEffect } from 'react';
import {Outlet, useNavigate } from 'react-router-dom';

const CMSLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/'); // Redirect ke halaman utama jika bukan admin
    }
  }, [navigate]);

  // Fungsi untuk kembali ke halaman root
  const handleBackToRoot = () => {
    navigate('/');
  };

  return (
    <div className="cms-layout">
      <Outlet/>
    </div>
  );
};

export default CMSLayout;