const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { v4: uuidv4 } = require('uuid');
const config = require('../../config');
const db = require('../../database/db');
const { sendEmail, generateOTP, getOtpEmailHtml } = require('../../services/email.service');

// In-memory OTP store: email -> { otp, data, expiresAt }
const otpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// Cleanup expired OTPs every 5 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of otpStore) {
    if (now > entry.expiresAt) otpStore.delete(key);
  }
}, 5 * 60 * 1000);

if (cleanupInterval && cleanupInterval.unref) {
  cleanupInterval.unref();
}

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits')
});

const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address')
});

const loginSchema = z.object({
  identifier: z.string().min(3, 'Phone or email required'),
  password: z.string().min(1, 'Password required')
});

// Step 1: Send OTP to email
async function sendRegistrationOtp(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const normalizedEmail = data.email.toLowerCase().trim();
    const normalizedPhone = data.phone.trim();

    // Check if user already exists
    const existingUser = await db.findUserByEmailOrPhone(normalizedPhone) || await db.findUserByEmailOrPhone(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this phone or email already exists. Please login instead.'
      });
    }

    const otp = generateOTP();

    // Store OTP with registration data
    otpStore.set(normalizedEmail, {
      otp,
      data: {
        ...data,
        email: normalizedEmail,
        phone: normalizedPhone
      },
      expiresAt: Date.now() + OTP_EXPIRY_MS
    });

    console.log(`[AUTH] Generated OTP ${otp} for ${normalizedEmail}`);

    // Send OTP email
    try {
      await sendEmail({
        to: normalizedEmail,
        subject: 'BSeva Registration OTP - बिहार सहायक',
        html: getOtpEmailHtml(otp)
      });
    } catch (emailErr) {
      console.warn('[AUTH] Note on email delivery:', emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Verification OTP has been sent to your email. Please check your inbox / spam folder.',
      email: normalizedEmail
    });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Invalid input data'
      });
    }
    next(error);
  }
}

// Resend OTP
async function resendRegistrationOtp(req, res, next) {
  try {
    const { email } = resendOtpSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    const entry = otpStore.get(normalizedEmail);
    if (!entry) {
      return res.status(400).json({
        success: false,
        message: 'No pending registration found for this email. Please start registration again.'
      });
    }

    const otp = generateOTP();
    entry.otp = otp;
    entry.expiresAt = Date.now() + OTP_EXPIRY_MS;
    otpStore.set(normalizedEmail, entry);

    console.log(`[AUTH] Re-sent OTP ${otp} for ${normalizedEmail}`);

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: 'BSeva Registration OTP (Resent) - बिहार सहायक',
        html: getOtpEmailHtml(otp)
      });
    } catch (emailErr) {
      console.warn('[AUTH] Note on resend email delivery:', emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'A new OTP has been sent to your email.'
    });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Invalid email address'
      });
    }
    next(error);
  }
}

// Step 2: Verify OTP and create user
async function verifyOtpAndRegister(req, res, next) {
  try {
    const { email, otp } = verifyOtpSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.trim();

    const entry = otpStore.get(normalizedEmail);
    if (!entry) {
      return res.status(400).json({
        success: false,
        message: 'No OTP requested for this email, or it has expired. Please request a new one.'
      });
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    if (entry.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect OTP. Please enter the 6-digit code sent to your email.'
      });
    }

    // OTP verified — create user
    const data = entry.data;
    otpStore.delete(normalizedEmail);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser = await db.createUser({
      id: uuidv4(),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: 'CITIZEN',
      status: 'ACTIVE'
    });

    // Create starter CitizenProfile
    try {
      await db.saveProfile(newUser.id, {
        district: 'Patna',
        age: 20,
        gender: 'MALE',
        education: 'PASS_12TH',
        isBiharResident: true,
        annualIncome: 100000
      });
    } catch (profErr) {
      console.warn('[AUTH] Note: Starter profile creation deferred:', profErr.message);
    }

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
      message: 'Email verified and registered successfully!',
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
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Invalid input data'
      });
    }
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const identifier = data.identifier.trim();

    const user = await db.findUserByEmailOrPhone(identifier);
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
        message: 'Invalid credentials. Please check your password.'
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
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Invalid login details'
      });
    }
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
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
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
  sendRegistrationOtp,
  resendRegistrationOtp,
  verifyOtpAndRegister,
  login,
  logout,
  getMe,
  _getOtpForTesting: (email) => otpStore.get(email.toLowerCase().trim())?.otp
};
