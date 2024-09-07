// routes.js

const express = require('express');
const router = express.Router();
const travelerController = require('../controllers/travelerController');
const authMiddleware = require('../middleware/authMiddleware');

// Traveler routes
router.post('/login', travelerController.login);
router.use(authMiddleware); // Apply authMiddleware to all routes below this line
router.get('/wallet', travelerController.getWalletBalance);
router.post('/wallet/top-up', travelerController.addWalletAmount);
router.get('/bus-timings', travelerController.getBusTimings);
router.get('/past-trips', travelerController.getPastTrips); // New route for past trips
router.get('/bus-timings/:fromStopId/:toStopId', travelerController.getBusTimings);
module.exports = router;

