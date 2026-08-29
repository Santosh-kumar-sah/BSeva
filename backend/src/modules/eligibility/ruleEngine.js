const { evaluateCondition } = require('./conditionEvaluator');

/**
 * Normalizes profile fields into snake_case format used by rules
 */
function normalizeProfile(profile = {}) {
  return {
    is_bihar_resident: profile.is_bihar_resident !== undefined ? profile.is_bihar_resident : profile.isBiharResident,
    age: profile.age !== undefined ? Number(profile.age) : undefined,
    gender: profile.gender ? String(profile.gender).toUpperCase() : undefined,
    social_category: profile.social_category || profile.socialCategory,
    education: profile.education ? String(profile.education).toUpperCase() : undefined,
    occupation: profile.occupation,
    annual_income: profile.annual_income !== undefined ? Number(profile.annual_income) : (profile.annualIncome !== undefined ? Number(profile.annualIncome) : undefined),
    land_holding_acres: profile.land_holding_acres !== undefined ? Number(profile.land_holding_acres) : (profile.landHoldingAcres !== undefined ? Number(profile.landHoldingAcres) : undefined),
    is_differently_abled: profile.is_differently_abled !== undefined ? profile.is_differently_abled : profile.isDifferentlyAbled,
    skills: profile.skills || [],
    interests: profile.interests || [],
    district: profile.district,
    block: profile.block,
    // Enhanced profile factors with intelligent schema-aligned defaults
    marital_status: profile.marital_status || profile.maritalStatus || 'UNMARRIED',
    employment_status: profile.employment_status || profile.employmentStatus || (profile.age && Number(profile.age) <= 25 ? 'STUDENT' : 'UNEMPLOYED'),
    ration_card_type: profile.ration_card_type || profile.rationCardType || 'NONE',
    area_type: profile.area_type || profile.areaType || 'RURAL',
    farmer_type: profile.farmer_type || profile.farmerType || (Number(profile.land_holding_acres !== undefined ? profile.land_holding_acres : profile.landHoldingAcres) > 0 ? 'LANDOWNER_RAIYAT' : 'NOT_FARMER'),
    is_minority: profile.is_minority !== undefined ? profile.is_minority : (profile.isMinority !== undefined ? profile.isMinority : false),
    has_govt_employee_in_family: profile.has_govt_employee_in_family !== undefined ? profile.has_govt_employee_in_family : (profile.hasGovtEmployeeInFamily !== undefined ? profile.hasGovtEmployeeInFamily : false),
    is_income_tax_payer: profile.is_income_tax_payer !== undefined ? profile.is_income_tax_payer : (profile.isIncomeTaxPayer !== undefined ? profile.isIncomeTaxPayer : false),
    is_aadhaar_dbt_linked: profile.is_aadhaar_dbt_linked !== undefined ? profile.is_aadhaar_dbt_linked : (profile.isAadhaarDbtLinked !== undefined ? profile.isAadhaarDbtLinked : true),
    has_cleared_prelims: profile.has_cleared_prelims !== undefined ? profile.has_cleared_prelims : (profile.hasClearedPrelims !== undefined ? profile.hasClearedPrelims : false),
    has_fishery_pond: profile.has_fishery_pond !== undefined ? profile.has_fishery_pond : (profile.hasFisheryPond !== undefined ? profile.hasFisheryPond : false),
    is_migrant_worker: profile.is_migrant_worker !== undefined ? profile.is_migrant_worker : (profile.isMigrantWorker !== undefined ? profile.isMigrantWorker : false),
    has_electricity_connection: profile.has_electricity_connection !== undefined ? profile.has_electricity_connection : (profile.hasElectricityConnection !== undefined ? profile.hasElectricityConnection : true),
    is_sports_medalist: profile.is_sports_medalist !== undefined ? profile.is_sports_medalist : (profile.isSportsMedalist !== undefined ? profile.isSportsMedalist : false)
  };
}

/**
 * Evaluates a single scheme's rules against a normalized profile
 */
function evaluateSchemeRules(scheme, rules, rawProfile) {
  const profile = normalizeProfile(rawProfile);

  if (!rules || rules.length === 0) {
    return {
      schemeId: scheme.id,
      schemeSlug: scheme.slug,
      title_en: scheme.title_en,
      title_hi: scheme.title_hi,
      status: 'NEEDS_VERIFICATION',
      matchScore: 50,
      passedRules: [],
      failedRules: [],
      missingFields: [],
      officialPortalUrl: scheme.official_portal_url,
      requiredDocuments: scheme.required_documents || []
    };
  }

  // Group rules by rule.group (default to 1)
  const ruleGroups = {};
  rules.forEach(rule => {
    const groupKey = rule.group || 1;
    if (!ruleGroups[groupKey]) ruleGroups[groupKey] = [];
    ruleGroups[groupKey].push(rule);
  });

  const groupResults = [];

  for (const [groupKey, groupRules] of Object.entries(ruleGroups)) {
    let groupPassed = true;
    let groupHasMissing = false;
    const passed = [];
    const failed = [];
    const missing = [];

    for (const rule of groupRules) {
      const profileValue = profile[rule.field];
      const evalRes = evaluateCondition(profileValue, rule.operator, rule.value);

      const ruleDetail = {
        field: rule.field,
        operator: rule.operator,
        expected: rule.value,
        actual: profileValue,
        message_hi: rule.message_hi || `${rule.field} शर्त`
      };

      if (evalRes.missingField) {
        groupHasMissing = true;
        groupPassed = false;
        missing.push(ruleDetail);
      } else if (evalRes.passed) {
        passed.push(ruleDetail);
      } else {
        groupPassed = false;
        failed.push(ruleDetail);
      }
    }

    groupResults.push({
      groupKey,
      passed: groupPassed,
      hasMissing: groupHasMissing,
      passedCount: passed.length,
      totalCount: groupRules.length,
      passedRules: passed,
      failedRules: failed,
      missingRules: missing
    });
  }

  // Scheme eligibility: If ANY group passed completely -> POTENTIALLY_ELIGIBLE
  const anyGroupPassed = groupResults.some(g => g.passed);
  const bestGroup = groupResults.reduce((best, curr) => (curr.passedCount / curr.totalCount > best.passedCount / best.totalCount ? curr : best), groupResults[0]);

  let status = 'LIKELY_NOT_ELIGIBLE';
  let matchScore = Math.round((bestGroup.passedCount / bestGroup.totalCount) * 100);

  if (anyGroupPassed) {
    status = 'POTENTIALLY_ELIGIBLE';
    matchScore = 100;
  } else if (bestGroup.hasMissing && bestGroup.failedRules.length === 0) {
    status = 'NEEDS_VERIFICATION';
    matchScore = 60;
  }

  return {
    schemeId: scheme.id,
    schemeSlug: scheme.slug,
    title_en: scheme.title_en,
    title_hi: scheme.title_hi,
    category_id: scheme.category_id,
    department_id: scheme.department_id,
    status,
    matchScore,
    passedRules: bestGroup.passedRules,
    failedRules: bestGroup.failedRules,
    missingRules: bestGroup.missingRules,
    officialPortalUrl: scheme.official_portal_url,
    benefits_hi: scheme.benefits_hi,
    benefits_en: scheme.benefits_en,
    requiredDocuments: scheme.required_documents || []
  };
}

/**
 * Batch evaluates all schemes in database against a citizen profile
 */
function evaluateAllSchemes(schemes, rulesList, profile) {
  return schemes
    .map(scheme => {
      const schemeRules = rulesList.find(r => r.scheme_id === scheme.id || r.scheme_slug === scheme.slug);
      return evaluateSchemeRules(scheme, schemeRules ? schemeRules.rules : [], profile);
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  normalizeProfile,
  evaluateSchemeRules,
  evaluateAllSchemes
};
