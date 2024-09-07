import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await handleLogin(username, password); // Call handleLogin with username and password

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Navigate to traveler dashboard after successful login
      navigate('/traveler-dashboard');
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('Invalid username or password'); // Set a generic error message for failed login
    }
  };

  return (
    <div className="login-container">
      <h2>Traveler Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
    </div>
  );

};

export default Login;
