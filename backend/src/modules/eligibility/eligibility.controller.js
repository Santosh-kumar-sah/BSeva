const db = require('../../database/db');
const { evaluateAllSchemes } = require('./ruleEngine');

async function checkEligibility(req, res, next) {
  try {
    let profile = req.body.profile;

    // If authenticated and no profile in body, fallback to stored user profile
    if (!profile && req.user) {
      profile = await db.getProfileByUserId(req.user.id);
    }

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Profile data is required for eligibility evaluation.'
      });
    }

    const schemes = await db.getSchemes({ status: 'ACTIVE' });
    const allRules = await db.getAllRules();

    // Reconstruct rules grouped by scheme_id
    const rulesList = schemes.map(s => ({
      scheme_id: s.id,
      scheme_slug: s.slug,
      rules: allRules.filter(r => r.schemeId === s.id)
    }));

    const results = evaluateAllSchemes(schemes, rulesList, profile);

    const potentiallyEligible = results.filter(r => r.status === 'POTENTIALLY_ELIGIBLE');
    const needsVerification = results.filter(r => r.status === 'NEEDS_VERIFICATION');
    const likelyNotEligible = results.filter(r => r.status === 'LIKELY_NOT_ELIGIBLE');

    // Record check log in Supabase PostgreSQL
    if (req.user) {
      await db.logEligibilityCheck({
        userId: req.user.id,
        totalEvaluated: results.length,
        eligibleCount: potentiallyEligible.length,
        matchedSchemes: potentiallyEligible.map(s => ({ id: s.schemeId, slug: s.schemeSlug, title: s.title_hi }))
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
    const userLogs = await db.getEligibilityLogs(req.user.id);
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
