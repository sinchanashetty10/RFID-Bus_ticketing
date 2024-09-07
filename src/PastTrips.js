import React, { useState, useEffect } from 'react';

const PastTrips = () => {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');

  // Fetch past trips function
  const fetchPastTrips = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/traveler/past-trips', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch past trips: ${errorData.error}`);
      }
      const data = await response.json();
      setTrips(data.trips);
    } catch (error) {
      console.error('Error fetching past trips:', error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchPastTrips();
  }, []);

  return (
    <div>
      <h3>Past Trips</h3>
      {error && <p>Error: {error}</p>}
      {trips.length > 0 ? (
        <ul>
          {trips.map((trip) => (
            <li key={trip.trip_id}>
              {`Trip from ${trip.boarding_stop_name} to ${trip.deboarding_stop_name} on ${trip.boarding_time} - Fare: $${trip.fare_amount}`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No past trips available</p>
      )}
    </div>
  );
};

export default PastTrips;
