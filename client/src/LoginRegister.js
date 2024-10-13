import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginRegister.css'; // Pastikan kamu memiliki file LoginRegister.css untuk styling

const LoginRegister = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi

  // Fungsi untuk mengirim data registrasi ke backend
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', { name, username, password });
      setSuccessMessage('Registration successful! You can now log in.');
      setIsRegistering(false);
    } catch (error) {
      setError('Failed to register. Username might already be taken.');
    }
  };

  // Fungsi untuk mengirim data login ke backend
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      window.location.href = '/'; // Redirect ke halaman utama setelah login sukses
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  // Fungsi untuk navigasi kembali
  const handleBackClick = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  return (
    <div className="login-container">
      {isRegistering ? (
        // Form registrasi
        <form className="login-form" onSubmit={handleRegisterSubmit}>
          <h2>Register</h2>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <div className="form-group">
            <label>Name</label>
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
          <button type="submit">Register</button>
          <p>
            Already have an account?{' '}
            <span className="toggle-link" onClick={() => setIsRegistering(false)}>
              Log In
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
          {error && <p className="error">{error}</p>}
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
            Don't have an account?{' '}
            <span className="toggle-link" onClick={() => setIsRegistering(true)}>
              Register
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