const db = require('../../database/db');
const { evaluateAllSchemes } = require('./ruleEngine');

async function checkEligibility(req, res, next) {
  try {
    let profile = req.body.profile;

    // If authenticated and no profile in body, fallback to stored user profile
    if (!profile && req.user) {
      profile = db.getProfileByUserId(req.user.id);
    }

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Profile data is required for eligibility evaluation.'
      });
    }

    const schemes = db.getSchemes({ status: 'ACTIVE' });
    const results = evaluateAllSchemes(schemes, db.rules, profile);

    const potentiallyEligible = results.filter(r => r.status === 'POTENTIALLY_ELIGIBLE');
    const needsVerification = results.filter(r => r.status === 'NEEDS_VERIFICATION');
    const likelyNotEligible = results.filter(r => r.status === 'LIKELY_NOT_ELIGIBLE');

    // Record check log if authenticated
    if (req.user) {
      db.eligibilityLogs.push({
        id: `check-${Date.now()}`,
        userId: req.user.id,
        timestamp: new Date().toISOString(),
        totalEvaluated: results.length,
        eligibleCount: potentiallyEligible.length
      });
    }

    res.json({
      success: true,
      totalEvaluated: results.length,
      summary: {
        potentiallyEligibleCount: potentiallyEligible.length,
        needsVerificationCount: needsVerification.length,
        likelyNotEligibleCount: likelyNotEligible.length
      },
      results: {
        potentiallyEligible,
        needsVerification,
        likelyNotEligible
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getCheckHistory(req, res, next) {
  try {
    const userLogs = db.eligibilityLogs.filter(l => l.userId === req.user.id);
    res.json({
      success: true,
      count: userLogs.length,
      history: userLogs
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkEligibility,
  getCheckHistory
};
