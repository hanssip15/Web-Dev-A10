import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginRegister.css';

const LoginRegister = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Fungsi untuk mengirim data registrasi ke backend
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', { name, username, password });
      setSuccessMessage('Registrasi berhasil! Silakan login.');
      setIsRegistering(false);
    } catch (error) {
      setError('Gagal registrasi. Username mungkin sudah digunakan.');
    }
  };

  // Fungsi untuk mengirim data login ke backend
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      const { token, role } = response.data;

      // Simpan token dan role di localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Arahkan ke halaman utama setelah login berhasil
      navigate('/');
    } catch (error) {
      // Jika akun sedang disuspend, tampilkan pesan dengan waktu berakhir suspend
      if (error.response && error.response.status === 403) {
        setError(error.response.data.message);
      } else {
        setError('Username atau password salah.');
      }
    }
  };

  // Fungsi untuk navigasi kembali
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="login-container">
      {isRegistering ? (
        // Form registrasi
        <form className="login-form" onSubmit={handleRegisterSubmit}>
          <h2>Registrasi</h2>
          {error && <p>{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Daftar</button>
          <p>
            Sudah punya akun?{' '}
            <span className="toggle-link" onClick={() => setIsRegistering(false)}>
              Login
            </span>
          </p>
          <button type="button" className="back-button" onClick={handleBackClick}>
            Kembali
          </button>
        </form>
      ) : (
        // Form login
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <h2>Login</h2>
          {error && <h4 className="error">{error}</h4>}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <p>
            Belum punya akun?{' '}
            <span className="toggle-link" onClick={() => setIsRegistering(true)}>
              Daftar
            </span>
          </p>
          <button type="button" className="back-button" onClick={handleBackClick}>
            Kembali
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginRegister;