const db = require('../../database/db');

async function getAnalytics(req, res, next) {
  try {
    const summary = await db.getAnalyticsSummary();
    const recentAuditLogs = await db.getAuditLogs(10);

    res.json({
      success: true,
      metrics: {
        totalUsers: summary.totalUsers,
        totalSchemes: summary.totalSchemes,
        totalCareers: summary.totalCareers,
        totalEligibilityChecks: summary.totalEligibilityChecks
      },
      categoryDistribution: summary.categoryDistribution,
      recentAuditLogs
    });
  } catch (error) {
    next(error);
  }
}

async function verifyScheme(req, res, next) {
  try {
    const { id } = req.params;
    const { status = 'ACTIVE' } = req.body;

    const updated = await db.updateSchemeStatus(id, status, req.user.id);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.'
      });
    }

    res.json({
      success: true,
      message: `Scheme ${id} updated to ${status} with verification audit entry in Supabase.`,
      scheme: updated
    });
  } catch (error) {
    next(error);
  }
}

async function getAuditLogs(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const auditLogs = await db.getAuditLogs(limit);

    res.json({
      success: true,
      count: auditLogs.length,
      auditLogs
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
