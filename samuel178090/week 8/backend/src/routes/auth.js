const express = require('express');
const router = express.Router();

// Mock users database
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@deployhub.com' },
  { id: 2, username: 'user', password: 'user123', role: 'user', email: 'user@deployhub.com' },
  { id: 3, username: 'developer', password: 'dev123', role: 'user', email: 'dev@deployhub.com' }
];

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Mock JWT token
  const token = `mock_token_${user.id}_${Date.now()}`;
  
  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    },
    token
  });
});

// Register endpoint
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password, and email required' });
  }
  
  const existingUser = users.find(u => u.username === username || u.email === email);
  
  if (existingUser) {
    return res.status(409).json({ error: 'Username or email already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    username,
    password,
    email,
    role: 'user'
  };
  
  users.push(newUser);
  
  const token = `mock_token_${newUser.id}_${Date.now()}`;
  
  res.status(201).json({
    message: 'Registration successful',
    user: {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      email: newUser.email
    },
    token
  });
});

// Get current user
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Mock token validation
  const token = authHeader.replace('Bearer ', '');
  const userId = token.split('_')[2];
  const user = users.find(u => u.id == userId);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  res.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    }
  });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;