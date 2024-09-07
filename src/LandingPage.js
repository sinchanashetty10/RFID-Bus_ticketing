import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Make sure to create this CSS file

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="content">
        <h1>Welcome to SmartRide Bus Ticketing System</h1>
        <p>
          Experience hassle-free travel with our state-of-the-art RFID-based bus ticketing system. 
          Say goodbye to paper tickets and long queues!
        </p>
        <p>
          Our innovative system allows you to simply tap your RFID card when boarding and alighting, 
          automatically calculating your fare and deducting it from your account balance.
        </p>
        <p>
          Enjoy the convenience of easy top-ups, real-time balance checking, and detailed travel history. 
          Join us in making public transportation smarter and more efficient!
        </p>
        <div className="button-container">
          <Link to="/traveler-login">
            <button className="login-button">Traveler Portal</button>
          </Link>
          <Link to="/admin-login">
            <button className="login-button admin">Admin Dashboard</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;