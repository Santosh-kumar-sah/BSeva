const fs = require('fs');
const path = require('path');

function loadSeedData() {
  const seedDir = path.resolve(__dirname, '../../../data/seed');

  try {
    const departments = JSON.parse(fs.readFileSync(path.join(seedDir, 'departments.json'), 'utf8'));
    const categories = JSON.parse(fs.readFileSync(path.join(seedDir, 'categories.json'), 'utf8'));
    const schemes = JSON.parse(fs.readFileSync(path.join(seedDir, 'schemes.json'), 'utf8'));
    const rules = JSON.parse(fs.readFileSync(path.join(seedDir, 'rules.json'), 'utf8'));
    const careers = JSON.parse(fs.readFileSync(path.join(seedDir, 'careers.json'), 'utf8'));

    return {
      departments,
      categories,
      schemes,
      rules,
      careers
    };
  } catch (error) {
    console.error('[SEED LOADER] Error reading seed files:', error.message);
    return {
      departments: [],
      categories: [],
      schemes: [],
      rules: [],
      careers: []
    };
  }
}

module.exports = {
  loadSeedData
};
