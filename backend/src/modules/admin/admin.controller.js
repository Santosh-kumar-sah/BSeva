const db = require('../../database/db');

async function getAnalytics(req, res, next) {
  try {
    const totalUsers = db.users.length;
    const totalSchemes = db.schemes.length;
    const totalCareers = db.careers.length;
    const totalChecks = db.eligibilityLogs.length;

    // Category breakdown
    const categoryCounts = {};
    db.schemes.forEach(s => {
      categoryCounts[s.category_id] = (categoryCounts[s.category_id] || 0) + 1;
    });

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalSchemes,
        totalCareers,
        totalEligibilityChecks: totalChecks
      },
      categoryDistribution: categoryCounts,
      recentAuditLogs: db.getAuditLogs(10)
    });
  } catch (error) {
    next(error);
  }
}

async function verifyScheme(req, res, next) {
  try {
    const { id } = req.params;
    const { status = 'ACTIVE' } = req.body;

    const updated = db.updateSchemeStatus(id, status, req.user.id);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.'
      });
    }

    res.json({
      success: true,
      message: `Scheme ${id} updated to ${status} with verification audit entry.`,
      scheme: updated
    });
  } catch (error) {
    next(error);
  }
}

async function getAuditLogs(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    res.json({
      success: true,
      count: db.auditLogs.length,
      auditLogs: db.getAuditLogs(limit)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAnalytics,
  verifyScheme,
  getAuditLogs
};
