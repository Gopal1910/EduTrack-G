const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role, ...rest } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      class: rest.class, // required if student
      rollNumber: rest.rollNumber,
      instituteName: rest.instituteName || 'Default Institute',
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully',
        userId: user._id
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Auth user & get tokens
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id, user.role);

      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401);
      throw new Error('No refresh token provided');
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.status(403);
      throw new Error('Invalid refresh token');
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        res.status(403);
        return next(new Error('Refresh token expired or invalid'));
      }

      // Token rotation
      const newAccessToken = generateAccessToken(user._id, user.role);
      const newRefreshToken = generateRefreshToken(user._id, user.role);

      user.refreshToken = newRefreshToken;
      await user.save();

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, refresh, logout };
