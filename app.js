const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();

// 1. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

// 3. Import Route Files
const userRoutes = require('./routes/users');
const newsRoutes = require('./routes/news');
const preferencesRoutes = require('./routes/preferences');

// 4. Register Routes
// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Public routes
app.use('/users', userRoutes);

// Protected routes (Require Authentication)
app.use('/news', authenticateToken, newsRoutes);
app.use('/users/preferences', authenticateToken, preferencesRoutes);

// 5. Export App (CRITICAL for tests to work)
module.exports = app;

// 6. Start Server ONLY if run directly (node app.js)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}