const db = require('../../database/db');

async function getSchemes(req, res, next) {
  try {
    const { category, department, search, status = 'ACTIVE', page = 1, limit = 20 } = req.query;

    const allSchemes = db.getSchemes({ category, department, search, status });

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedSchemes = allSchemes.slice(startIndex, endIndex).map(scheme => {
      const dept = db.departments.find(d => d.id === scheme.department_id);
      const cat = db.categories.find(c => c.id === scheme.category_id);
      return {
        ...scheme,
        department: dept ? { name_en: dept.name_en, name_hi: dept.name_hi, code: dept.code } : null,
        category: cat ? { name_en: cat.name_en, name_hi: cat.name_hi, slug: cat.slug } : null
      };
    });

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
    const scheme = db.getSchemeBySlugOrId(slug);

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
    res.json({
      success: true,
      count: db.categories.length,
      categories: db.categories
    });
  } catch (error) {
    next(error);
  }
}

async function getDepartments(req, res, next) {
  try {
    res.json({
      success: true,
      count: db.departments.length,
      departments: db.departments
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
