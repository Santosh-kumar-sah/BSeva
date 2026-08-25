const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data', 'seed');

try {
  const departments = JSON.parse(fs.readFileSync(path.join(dataDir, 'departments.json'), 'utf8'));
  const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8'));
  const schemes = JSON.parse(fs.readFileSync(path.join(dataDir, 'schemes.json'), 'utf8'));
  const rules = JSON.parse(fs.readFileSync(path.join(dataDir, 'rules.json'), 'utf8'));
  const careers = JSON.parse(fs.readFileSync(path.join(dataDir, 'careers.json'), 'utf8'));

  console.log(`[VALIDATION] Departments Count: ${departments.length}`);
  console.log(`[VALIDATION] Categories Count: ${categories.length}`);
  console.log(`[VALIDATION] Schemes Count: ${schemes.length}`);
  console.log(`[VALIDATION] Rulesets Count: ${rules.length}`);
  console.log(`[VALIDATION] Careers Count: ${careers.length}`);

  const deptIds = new Set(departments.map(d => d.id));
  const catIds = new Set(categories.map(c => c.id));
  const ruleSchemeIds = new Set(rules.map(r => r.scheme_id));

  let errors = [];

  schemes.forEach((s, idx) => {
    if (!deptIds.has(s.department_id)) {
      errors.push(`Scheme #${idx+1} (${s.slug}) has invalid department_id: ${s.department_id}`);
    }
    if (!catIds.has(s.category_id)) {
      errors.push(`Scheme #${idx+1} (${s.slug}) has invalid category_id: ${s.category_id}`);
    }
    if (!ruleSchemeIds.has(s.id)) {
      errors.push(`Scheme #${idx+1} (${s.slug}) has no matching rules in rules.json`);
    }
  });

  if (errors.length > 0) {
    console.error(`[VALIDATION FAILED] ${errors.length} errors found:`);
    errors.forEach(e => console.error(` - ${e}`));
    process.exit(1);
  } else {
    console.log(`[SUCCESS] All datasets validated with 100% integrity across references and rules!`);
  }
} catch (err) {
  console.error('[ERROR]', err);
  process.exit(1);
}
