const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.get('/', getAllUsers);

module.exports = router;