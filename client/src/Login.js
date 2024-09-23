import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Mengimpor CSS yang sudah kamu buat

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mengirim request login ke backend
      const response = await axios.post('/api/login', { username, password });
      const { token } = response.data;

      // Simpan token di localStorage
      localStorage.setItem('token', token);

      // Redirect ke halaman dashboard atau halaman yang diinginkan
      window.location.href = '/';
    } catch (error) {
      // Menangani error login
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
};

export default Login;