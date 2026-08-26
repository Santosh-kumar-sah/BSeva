const express = require('express');
const router = express.Router();
const controller = require('./eligibility.controller');
const { optionalAuth, authenticateToken } = require('../../middleware/auth');

router.post('/check', optionalAuth, controller.checkEligibility);
router.get('/history', authenticateToken, controller.getCheckHistory);

module.exports = router;
