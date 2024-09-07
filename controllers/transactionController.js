// controllers/transactionController.js

const pool = require('../database'); // Require your MySQL connection pool

// Record a transaction
exports.recordTransaction = (req, res) => {
  const { userId } = req.params;
  const { amount, transactionType, description } = req.body;
  const transactionDate = new Date(); // Assuming current timestamp

  pool.query('INSERT INTO Transactions (user_id, transaction_date, amount, transaction_type, description) VALUES (?, ?, ?, ?, ?)',
    [userId, transactionDate, amount, transactionType, description],
    (err, results) => {
      if (err) {
        console.error('Error recording transaction: ' + err.stack);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      res.status(201).json({ message: 'Transaction recorded successfully', transactionId: results.insertId });
    });
};
