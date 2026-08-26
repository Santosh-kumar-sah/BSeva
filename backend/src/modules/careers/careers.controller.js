const db = require('../../database/db');
const { recommendCareers } = require('./careerRecommender');

async function getCareers(req, res, next) {
  try {
    const { industry } = req.query;
    const list = await db.getCareers({ industry });

    res.json({
      success: true,
      total: list.length,
      careers: list
    });
  } catch (error) {
    next(error);
  }
}

async function getCareerBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const career = await db.getCareerBySlugOrId(slug);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career path not found.'
      });
    }

    res.json({
      success: true,
      career
    });
  } catch (error) {
    next(error);
  }
}

async function recommend(req, res, next) {
  try {
    let profile = req.body.profile;

    if (!profile && req.user) {
      profile = await db.getProfileByUserId(req.user.id);
    }

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Profile data is required for career recommendation.'
      });
    }

    const allCareers = await db.getCareers();
    const recommendations = recommendCareers(allCareers, profile);

    res.json({
      success: true,
      totalCareers: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCareers,
  getCareerBySlug,
  recommend
};
