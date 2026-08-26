const db = require('../../database/db');

async function getSchemes(req, res, next) {
  try {
    const { category, department, search, status = 'ACTIVE', page = 1, limit = 20 } = req.query;

    const allSchemes = await db.getSchemes({ category, department, search, status });

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedSchemes = allSchemes.slice(startIndex, endIndex);

    res.json({
      success: true,
      total: allSchemes.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(allSchemes.length / limitNum),
      schemes: paginatedSchemes
    });
  } catch (error) {
    next(error);
  }
}

async function getSchemeBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const scheme = await db.getSchemeBySlugOrId(slug);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.'
      });
    }

    res.json({
      success: true,
      scheme
    });
  } catch (error) {
    next(error);
  }
}

async function getCategories(req, res, next) {
  try {
    const categories = await db.getCategories();
    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
}

async function getDepartments(req, res, next) {
  try {
    const departments = await db.getDepartments();
    res.json({
      success: true,
      count: departments.length,
      departments
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSchemes,
  getSchemeBySlug,
  getCategories,
  getDepartments
};
