const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { v4: uuidv4 } = require('uuid');
const config = require('../../config');
const db = require('../../database/db');

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  identifier: z.string().min(3, 'Phone or email required'),
  password: z.string().min(1, 'Password required')
});

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await db.findUserByEmailOrPhone(data.phone) || (data.email ? await db.findUserByEmailOrPhone(data.email) : null);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this phone or email already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser = await db.createUser({
      id: uuidv4(),
      fullName: data.fullName,
      email: data.email || null,
      phone: data.phone,
      passwordHash,
      role: 'CITIZEN',
      status: 'ACTIVE'
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, fullName: newUser.fullName },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: config.cookieMaxAge
    });

    res.status(201).json({
      success: true,
      message: 'Citizen registered successfully in Supabase PostgreSQL database',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await db.findUserByEmailOrPhone(data.identifier);
    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or inactive account.'
      });
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, fullName: user.fullName },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: config.cookieMaxAge
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res) {
  res.clearCookie('access_token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}

async function getMe(req, res, next) {
  try {
    const user = await db.findUserById(req.user.id);
    const profile = await db.getProfileByUserId(req.user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      profile
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe
};
