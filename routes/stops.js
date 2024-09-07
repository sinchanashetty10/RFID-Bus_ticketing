const express = require('express');
const router = express.Router();
const pool = require('../database'); // Assuming you have a database connection pool set up

// Route to fetch all bus stops
router.get('/', (req, res) => {
    pool.query('SELECT * FROM stops', (err, results) => {
        if (err) {
            console.error('Error fetching bus stops:', err);
            return res.status(500).json({ error: 'Failed to fetch bus stops' });
        }
        res.status(200).json({ stops: results });
    });
});

module.exports = router;
