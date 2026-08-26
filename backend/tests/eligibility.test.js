const { evaluateSchemeRules, evaluateAllSchemes } = require('../src/modules/eligibility/ruleEngine');
const { loadSeedData } = require('../src/database/seedLoader');

describe('Deterministic Eligibility Rule Engine Tests', () => {
  let seedData;

  beforeAll(() => {
    seedData = loadSeedData();
  });

  test('Persona 1: 19-year-old Female 12th Pass Student in Bihar (Income ₹1.5L)', () => {
    const studentProfile = {
      isBiharResident: true,
      age: 19,
      gender: 'FEMALE',
      socialCategory: 'EBC',
      education: '12TH_PASS',
      annualIncome: 150000
    };

    const results = evaluateAllSchemes(seedData.schemes, seedData.rules, studentProfile);
    const eligibleSlugs = results
      .filter(r => r.status === 'POTENTIALLY_ELIGIBLE')
      .map(r => r.schemeSlug);

    // Verify key expected schemes
    expect(eligibleSlugs).toContain('mukhyamantri-kanya-utthan-yojana-12th');
    expect(eligibleSlugs).toContain('bihar-student-credit-card-scheme');
    expect(eligibleSlugs).toContain('kushal-yuva-program-kyp');
    expect(eligibleSlugs).toContain('bihar-post-matric-scholarship-pms');

    // Should NOT be eligible for Old Age Pension or Widow Pension
    expect(eligibleSlugs).not.toContain('mukhyamantri-vriddhajan-pension-yojana');
    expect(eligibleSlugs).not.toContain('laxmibai-samajik-suraksha-pension');
  });

  test('Persona 2: 45-year-old Bihar Farmer with 2.0 Acres Land', () => {
    const farmerProfile = {
      isBiharResident: true,
      age: 45,
      gender: 'MALE',
      education: '10TH_PASS',
      annualIncome: 180000,
      landHoldingAcres: 2.0
    };

    const results = evaluateAllSchemes(seedData.schemes, seedData.rules, farmerProfile);
    const eligibleSlugs = results
      .filter(r => r.status === 'POTENTIALLY_ELIGIBLE')
      .map(r => r.schemeSlug);

    expect(eligibleSlugs).toContain('krishi-yantra-subsidy-scheme');
    expect(eligibleSlugs).toContain('bihar-diesel-anudan-subsidy');
    expect(eligibleSlugs).toContain('bihar-rajya-fasal-sahayata-yojana');
    expect(eligibleSlugs).toContain('mukhyamantri-tivra-beej-vistar-yojana');
    expect(eligibleSlugs).toContain('pm-kisan-bihar-dbt-portal');

    // Should NOT be eligible for Female or Youth-specific schemes
    expect(eligibleSlugs).not.toContain('mukhyamantri-kanya-utthan-yojana-12th');
    expect(eligibleSlugs).not.toContain('mukhyamantri-swayam-sahayata-bhatta-yojana');
  });

  test('Persona 3: 68-year-old Senior Citizen of Bihar', () => {
    const seniorProfile = {
      isBiharResident: true,
      age: 68,
      gender: 'MALE',
      annualIncome: 50000,
      education: 'BELOW_10TH'
    };

    const results = evaluateAllSchemes(seedData.schemes, seedData.rules, seniorProfile);
    const eligibleSlugs = results
      .filter(r => r.status === 'POTENTIALLY_ELIGIBLE')
      .map(r => r.schemeSlug);

    expect(eligibleSlugs).toContain('mukhyamantri-vriddhajan-pension-yojana');
    expect(eligibleSlugs).not.toContain('bihar-student-credit-card-scheme');
  });

  test('Persona 4: Non-Bihar Resident should fail resident criteria', () => {
    const nonResident = {
      isBiharResident: false,
      age: 20,
      gender: 'FEMALE',
      education: '12TH_PASS',
      annualIncome: 100000
    };

    const results = evaluateAllSchemes(seedData.schemes, seedData.rules, nonResident);
    const eligibleCount = results.filter(r => r.status === 'POTENTIALLY_ELIGIBLE').length;

    // Bihar specific schemes must reject non-residents
    expect(eligibleCount).toBe(0);
  });
});
