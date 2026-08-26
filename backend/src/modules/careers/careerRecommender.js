const EDUCATION_HIERARCHY = {
  'BELOW_10TH': 0,
  '10TH_PASS': 1,
  '12TH_PASS': 2,
  'DIPLOMA': 3,
  'VOCATIONAL': 3,
  'GRADUATE': 4,
  'POST_GRADUATE': 5,
  'DOCTORATE': 6
};

function calculateCareerScore(career, profile = {}) {
  const userEduRank = EDUCATION_HIERARCHY[profile.education] !== undefined ? EDUCATION_HIERARCHY[profile.education] : 0;
  const careerEduRank = EDUCATION_HIERARCHY[career.min_education] !== undefined ? EDUCATION_HIERARCHY[career.min_education] : 0;

  // 1. Education Fit (35%)
  let educationScore = 0;
  if (userEduRank >= careerEduRank) {
    educationScore = 100;
  } else {
    educationScore = Math.max(0, 100 - (careerEduRank - userEduRank) * 40);
  }

  // 2. Skill Overlap (45%)
  const userSkills = (profile.skills || []).map(s => s.toLowerCase().trim());
  const careerSkills = career.required_skills || [];
  
  const matchingSkills = [];
  const missingSkills = [];

  careerSkills.forEach(reqSkill => {
    const isMatched = userSkills.some(uSkill => 
      uSkill.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(uSkill)
    );
    if (isMatched) {
      matchingSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const skillScore = careerSkills.length > 0 
    ? (matchingSkills.length / careerSkills.length) * 100 
    : 50;

  // 3. Interest Alignment (20%)
  const userInterests = (profile.interests || []).map(i => i.toLowerCase().trim());
  let interestScore = 30; // base interest
  const hasInterestMatch = userInterests.some(interest => 
    career.industry.toLowerCase().includes(interest) ||
    career.title_en.toLowerCase().includes(interest) ||
    career.title_hi.toLowerCase().includes(interest)
  );
  if (hasInterestMatch) {
    interestScore = 100;
  }

  // Hybrid Formula: 35% Edu + 45% Skills + 20% Interests
  const finalScore = Math.round((educationScore * 0.35) + (skillScore * 0.45) + (interestScore * 0.20));

  return {
    careerId: career.id,
    slug: career.slug,
    title_en: career.title_en,
    title_hi: career.title_hi,
    industry: career.industry,
    min_education: career.min_education,
    avg_starting_salary_inr: career.avg_starting_salary_inr,
    growth_prospects: career.growth_prospects,
    description_hi: career.description_hi,
    description_en: career.description_en,
    matchScore: finalScore,
    matchingSkills,
    missingSkills,
    bsdmTrainingPath: career.bsdm_training_path || []
  };
}

function recommendCareers(careersList, profile) {
  return careersList
    .map(career => calculateCareerScore(career, profile))
    .sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  calculateCareerScore,
  recommendCareers
};
