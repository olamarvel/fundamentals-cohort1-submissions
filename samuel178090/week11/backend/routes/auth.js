const express = require('express');
const { login, validateToken, register, refreshToken, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate', authenticateToken, validateToken);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;