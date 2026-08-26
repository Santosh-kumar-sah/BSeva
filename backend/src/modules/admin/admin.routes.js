const express = require('express');
const router = express.Router();
const controller = require('./admin.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');

router.use(authenticateToken);
router.use(authorizeRoles('ADMIN', 'SUPER_ADMIN', 'DATA_VERIFIER'));

router.get('/analytics', controller.getAnalytics);
router.post('/schemes/:id/verify', controller.verifyScheme);
router.get('/audit-logs', controller.getAuditLogs);

module.exports = router;
