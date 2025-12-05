const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Database = require('../models/database');

const createAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_TTL || '15m' }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_TTL || '7d' }
  );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = Database.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Simple password check for demo
    const isValidPassword = password === 'password123';
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Save refresh token in DB for revocation support (POC)
    Database.saveRefreshToken({ token: refreshToken, userId: user.id, expiresAt: Date.now() + 7 * 24 * 3600 * 1000 });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const validateToken = (req, res) => {
  res.json({ valid: true, user: req.user });
};

const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if user exists
    const existingUser = Database.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = Database.createUser({ email, password, fullName });
    
    const accessToken = createAccessToken(newUser);
    const refreshToken = createRefreshToken(newUser);
    Database.saveRefreshToken({ token: refreshToken, userId: newUser.id, expiresAt: Date.now() + 7 * 24 * 3600 * 1000 });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: newUser.id, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    const saved = Database.findRefreshToken(refreshToken);
    if (!saved) return res.status(403).json({ error: 'Refresh token not recognized' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, (err, payload) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });

      const user = Database.findUserById(payload.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newAccessToken = createAccessToken(user);
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ error: 'Refresh failed' });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) Database.revokeRefreshToken(refreshToken);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

module.exports = { login, validateToken, register, refreshToken, logout };