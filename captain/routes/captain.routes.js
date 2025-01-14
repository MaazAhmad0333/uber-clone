const express = require('express');
const router = express.Router();
const captainController = require('../controllers/captain.controller')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/register', captainController.register);
router.post('/login', captainController.login);
router.get('/logout', captainController.logout);
router.get('/profile', authMiddleware.captainAuth ,captainController.profile);
router.patch('/toggle-availability', authMiddleware.captainAuth, captainController.toggleAvailability)

module.exports = router;