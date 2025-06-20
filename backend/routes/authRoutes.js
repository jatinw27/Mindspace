const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

// Protected route
router.get('/protected', protect, (req, res) => {
  res.json({ message: 'This is a protected route' });
});


// Register User
router.post('/register', async (req, res) => {
  console.log("Register body:", req.body);
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const user = new User({
      username,
      email,
      password
    });

    await user.save()
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User registered successfully', token });
  }catch(error){
    res.status(500).json({ message: 'Server error' });
  }
})

//  login user
router.post('/login', async(req,res) => {
  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  const user = await User.findOne({email});
  if(!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

//  check password match
const isMatch = await user.comparePassword(password);
if(!isMatch) {
  return res.status(400).json({ message: 'Invalid credentials' });
}

// create JWT token
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
  expiresIn: '1h'
  })
res.json({
  message: 'Login successful',
  token
})
});
module.exports = router;
