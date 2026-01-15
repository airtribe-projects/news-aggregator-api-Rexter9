const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [];

// Changed /register to /signup to match tests
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body; // Changed username to email

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    
    // Test expects 200 for signup success based on your logs
    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Changed username to email

    if (!email || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // Changed 400 to 401 to match tests
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;