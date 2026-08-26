const express = require('express');
const router = express.Router();
const controller = require('./profile.controller');
const { authenticateToken } = require('../../middleware/auth');

router.get('/', authenticateToken, controller.getProfile);
router.post('/', authenticateToken, controller.updateProfile);
router.patch('/', authenticateToken, controller.updateProfile);
router.put('/', authenticateToken, controller.updateProfile);

module.exports = router;
