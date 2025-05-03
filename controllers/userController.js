const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, country } = req.body;

    // Simple validation
    if (!name || !email || !password || !country) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      country
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      country: user.country,
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      country: user.country,
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Don't forget to export!
module.exports = {
  registerUser,
  loginUser
};