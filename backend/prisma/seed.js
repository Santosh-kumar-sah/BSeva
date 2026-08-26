const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function mapEducation(edu) {
  if (edu === '10TH_PASS') return 'PASS_10TH';
  if (edu === '12TH_PASS') return 'PASS_12TH';
  return edu;
}

async function main() {
  console.log('[SEED] Starting Supabase PostgreSQL database population...');

  const seedDir = path.resolve(__dirname, '../../data/seed');
  const departments = JSON.parse(fs.readFileSync(path.join(seedDir, 'departments.json'), 'utf8'));
  const categories = JSON.parse(fs.readFileSync(path.join(seedDir, 'categories.json'), 'utf8'));
  const schemes = JSON.parse(fs.readFileSync(path.join(seedDir, 'schemes.json'), 'utf8'));
  const rules = JSON.parse(fs.readFileSync(path.join(seedDir, 'rules.json'), 'utf8'));
  const careers = JSON.parse(fs.readFileSync(path.join(seedDir, 'careers.json'), 'utf8'));

  // 1. Departments
  console.log(`[SEED] Upserting ${departments.length} departments...`);
  for (const dept of departments) {
    await prisma.department.upsert({
      where: { id: dept.id },
      update: {
        code: dept.code,
        name_en: dept.name_en,
        name_hi: dept.name_hi,
        portal_url: dept.portal_url,
        contact_email: dept.contact_email,
        contact_phone: dept.contact_phone
      },
      create: {
        id: dept.id,
        code: dept.code,
        name_en: dept.name_en,
        name_hi: dept.name_hi,
        portal_url: dept.portal_url,
        contact_email: dept.contact_email,
        contact_phone: dept.contact_phone
      }
    });
  }

  // 2. Categories
  console.log(`[SEED] Upserting ${categories.length} categories...`);
  for (const cat of categories) {
    await prisma.schemeCategory.upsert({
      where: { id: cat.id },
      update: {
        slug: cat.slug,
        name_en: cat.name_en,
        name_hi: cat.name_hi,
        icon: cat.icon,
        description: cat.description
      },
      create: {
        id: cat.id,
        slug: cat.slug,
        name_en: cat.name_en,
        name_hi: cat.name_hi,
        icon: cat.icon,
        description: cat.description
      }
    });
  }

  // 3. Schemes & Rules
  console.log(`[SEED] Upserting ${schemes.length} verified schemes and rules...`);
  for (const scheme of schemes) {
    await prisma.scheme.upsert({
      where: { id: scheme.id },
      update: {
        slug: scheme.slug,
        departmentId: scheme.department_id,
        categoryId: scheme.category_id,
        title_en: scheme.title_en,
        title_hi: scheme.title_hi,
        description_en: scheme.description_en,
        description_hi: scheme.description_hi,
        benefits_en: scheme.benefits_en,
        benefits_hi: scheme.benefits_hi,
        application_mode: scheme.application_mode || 'ONLINE',
        official_portal_url: scheme.official_portal_url,
        official_guideline_url: scheme.official_guideline_url,
        status: scheme.status || 'ACTIVE',
        last_verified_date: scheme.last_verified_date || '2026-08-25',
        version: scheme.version || '1.0',
        required_documents: scheme.required_documents || []
      },
      create: {
        id: scheme.id,
        slug: scheme.slug,
        departmentId: scheme.department_id,
        categoryId: scheme.category_id,
        title_en: scheme.title_en,
        title_hi: scheme.title_hi,
        description_en: scheme.description_en,
        description_hi: scheme.description_hi,
        benefits_en: scheme.benefits_en,
        benefits_hi: scheme.benefits_hi,
        application_mode: scheme.application_mode || 'ONLINE',
        official_portal_url: scheme.official_portal_url,
        official_guideline_url: scheme.official_guideline_url,
        status: scheme.status || 'ACTIVE',
        last_verified_date: scheme.last_verified_date || '2026-08-25',
        version: scheme.version || '1.0',
        required_documents: scheme.required_documents || []
      }
    });

    // Delete existing rules for this scheme to re-seed cleanly
    await prisma.eligibilityRule.deleteMany({ where: { schemeId: scheme.id } });

    const schemeRuleset = rules.find(r => r.scheme_id === scheme.id || r.scheme_slug === scheme.slug);
    if (schemeRuleset && schemeRuleset.rules) {
      for (const r of schemeRuleset.rules) {
        await prisma.eligibilityRule.create({
          data: {
            schemeId: scheme.id,
            group: r.group || 1,
            field: r.field,
            operator: r.operator,
            value: r.value,
            message_hi: r.message_hi || null,
            message_en: r.message_en || null,
            is_mandatory: r.is_mandatory !== undefined ? r.is_mandatory : true
          }
        });
      }
    }
  }

  // 4. Careers
  console.log(`[SEED] Upserting ${careers.length} careers...`);
  for (const car of careers) {
    await prisma.careerPath.upsert({
      where: { id: car.id },
      update: {
        slug: car.slug,
        title_en: car.title_en,
        title_hi: car.title_hi,
        industry: car.industry,
        min_education: mapEducation(car.min_education),
        avg_starting_salary_inr: car.avg_starting_salary_inr,
        growth_prospects: car.growth_prospects,
        description_en: car.description_en,
        description_hi: car.description_hi,
        required_skills: car.required_skills || [],
        bsdm_training_path: car.bsdm_training_path || []
      },
      create: {
        id: car.id,
        slug: car.slug,
        title_en: car.title_en,
        title_hi: car.title_hi,
        industry: car.industry,
        min_education: mapEducation(car.min_education),
        avg_starting_salary_inr: car.avg_starting_salary_inr,
        growth_prospects: car.growth_prospects,
        description_en: car.description_en,
        description_hi: car.description_hi,
        required_skills: car.required_skills || [],
        bsdm_training_path: car.bsdm_training_path || []
      }
    });
  }

  // 5. Default Admin User
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('Admin@Bihar2026', salt);
  await prisma.user.upsert({
    where: { phone: '9999900001' },
    update: {
      fullName: 'Bihar Sahayak Admin',
      email: 'admin@biharsahayak.gov.in',
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    create: {
      id: 'usr-admin-001',
      fullName: 'Bihar Sahayak Admin',
      email: 'admin@biharsahayak.gov.in',
      phone: '9999900001',
      passwordHash: adminHash,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  console.log('[SEED] ✅ Supabase PostgreSQL database seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('[SEED ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
