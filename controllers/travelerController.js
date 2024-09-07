const pool = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controller method to fetch wallet balance for the logged-in traveler
exports.getWalletBalance = (req, res) => {
  const travelerId = req.userId; // Assuming you have user ID in JWT payload

  pool.query(
    'SELECT balance FROM wallet WHERE user_id = ?',
    [travelerId],
    (err, results) => {
      if (err) {
        console.error('Error fetching wallet balance:', err);
        return res.status(500).json({ error: 'Failed to fetch wallet balance' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Wallet balance not found for the traveler' });
      } 

      const balance = results[0].balance;
      res.status(200).json({ balance });
    }
  );
};
exports.addWalletAmount = (req, res) => {
  const travelerId = req.userId; // Assuming you have user ID in JWT payload
  const { amount } = req.body;

  // Validate input
  if (isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid amount value' });
  }

  const amountToAdd = parseFloat(amount);

  // Get current balance
  pool.query('SELECT balance FROM wallet WHERE user_id = ?', [travelerId], (err, results) => {
    if (err) {
      console.error('Error fetching current wallet balance:', err);
      return res.status(500).json({ error: 'Failed to fetch current wallet balance' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Wallet not found for the traveler' });
    }

    const currentBalance = parseFloat(results[0].balance);
    const newBalance = currentBalance + amountToAdd;

    // Update wallet balance
    pool.query('UPDATE wallet SET balance = ? WHERE user_id = ?', [newBalance, travelerId], (err, updateResults) => {
      if (err) {
        console.error('Error updating wallet balance:', err);
        return res.status(500).json({ error: 'Failed to update wallet balance' });
      }

      if (updateResults.affectedRows === 0) {
        return res.status(404).json({ error: 'Wallet not found for the traveler' });
      }

      res.status(200).json({ message: 'Wallet balance updated successfully', newBalance });
    });
  });
};

// Controller method to fetch past trips for the logged-in traveler
exports.getPastTrips = (req, res) => {
  const travelerId = req.userId; // Assuming you have user ID in JWT payload

  // First, get the traveler's RFID card number
  pool.query('SELECT rfid_id FROM rfid_cards WHERE user_id = ?', [travelerId], (err, results) => {
    if (err) {
      console.error('Error fetching RFID card:', err);
      return res.status(500).json({ error: 'Failed to fetch RFID card' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'RFID card not found for the traveler' });
    }

    const rfidId = results[0].rfid_id;

    // Fetch past trips for the RFID card with stop names
    const query = `
      SELECT t.trip_id, t.boarding_time, t.deboarding_time, t.fare_amount, 
             bs.stop_name AS boarding_stop_name, ds.stop_name AS deboarding_stop_name
      FROM trips t
      JOIN stops bs ON t.boarding_stop_id = bs.stop_id
      LEFT JOIN stops ds ON t.deboarding_stop_id = ds.stop_id
      WHERE t.rfid_id = ?
    `;

    pool.query(query, [rfidId], (err, tripsResults) => {
      if (err) {
        console.error('Error fetching past trips:', err);
        return res.status(500).json({ error: 'Failed to fetch past trips' });
      }

      if (tripsResults.length === 0) {
        return res.status(404).json({ error: 'No past trips found for the traveler' });
      }

      res.status(200).json({ trips: tripsResults });
    });
  });
};

exports.getBusTimings = (req, res) => {
  const { fromStopId, toStopId } = req.params;

  pool.query(
    'SELECT * FROM bus_timings WHERE from_stop = ? AND to_stop = ?',
    [fromStopId, toStopId],
    (err, results) => {
      if (err) {
        console.error('Error fetching bus timings:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(200).json({ busTimings: results });
    }
  );
};



// Login function
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Query to find user by username
  pool.query('SELECT * FROM Users WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        console.error('Error querying database:', err.stack);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      const user = results[0];

      // Compare the password with the hashed password in the database
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err.stack);
          res.status(500).json({ error: 'Server error' });
          return;
        }

        if (!isMatch) {
          res.status(401).json({ error: 'Invalid username or password' });
          return;
        }

        // Passwords match, generate JWT token for authentication
        const token = jwt.sign(
          { userId: user.user_id, username: user.username, role: user.role },
          process.env.JWT_SECRET, // Use your actual JWT secret stored in environment variables
          { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Return success response with token and user details
        res.status(200).json({
          message: 'Login successful',
          token: token,
          userId: user.user_id,
          username: user.username,
          name: user.name,
          email: user.email
        });
      });
    });
};


