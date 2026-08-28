const express = require('express');
const router = express.Router();

const authRoutes = require('./modules/auth/auth.routes');
const profileRoutes = require('./modules/profile/profile.routes');
const schemesRoutes = require('./modules/schemes/schemes.routes');
const eligibilityRoutes = require('./modules/eligibility/eligibility.routes');
const careersRoutes = require('./modules/careers/careers.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const aiRoutes = require('./modules/ai/ai.routes');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Bihar Sahayak (BSeva)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Module Routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/schemes', schemesRoutes);
router.use('/eligibility', eligibilityRoutes);
router.use('/careers', careersRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
