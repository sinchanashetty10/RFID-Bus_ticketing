import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import TravelerDashboard from './TravelerDashboard';
import Login from './Login'; // Import the Login component

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null); // Track logged-in user

  const handleAdminLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const userData = await response.json();
      
    setLoggedInUser({ username: userData.username, role: 'admin' });
    return userData.token;
  } catch (error) {
      console.error('Admin login failed:', error.message);
      throw error;
      // Handle login failure (e.g., show error message to user)
    }
  };

  const handleTravelerLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/traveler/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error); // Throw the specific error message from the backend
      }
  
      const userData = await response.json();
      setLoggedInUser({ username: userData.username, role: 'traveler' });
  
      return userData.token; // Return the token from the backend response
    } catch (error) {
      console.error('Traveler login failed:', error.message);
      throw error;
      // Handle login failure (e.g., show error message to user)
    }
  };
  

  const handleLogout = () => {
    setLoggedInUser(null); // Clear logged-in user state
    // Redirect to the landing page after logout
    window.location.href = '/'; // Use window.location.href for full-page reload
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin-login" className="nav-link">Admin Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/traveler-login" className="nav-link">Traveler Login</Link>
            </li>
            {loggedInUser && (
              <li className="nav-item">
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </li>
            )}
          </ul>
        </nav>
  
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin-login" element={<AdminLogin handleAdminLogin={handleAdminLogin} />} />
            <Route path="/traveler-login" element={<Login handleLogin={handleTravelerLogin} />} />
            <Route path="/admin-dashboard" element={<AdminDashboard adminName={loggedInUser?.username} />} />
            <Route path="/traveler-dashboard" element={<TravelerDashboard travelerName={loggedInUser?.username} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
