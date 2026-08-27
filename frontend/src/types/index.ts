export type UserRole = 'CITIZEN' | 'DATA_VERIFIER' | 'ANALYST' | 'ADMIN' | 'SUPER_ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type GenderType = 'MALE' | 'FEMALE' | 'OTHER' | 'ALL';

export type SocialCategory = 'GENERAL' | 'OBC' | 'EBC' | 'SC' | 'ST' | 'EWS' | 'ALL';

export type EducationLevel =
  | 'BELOW_10TH'
  | '10TH_PASS'
  | '12TH_PASS'
  | 'PASS_10TH'
  | 'PASS_12TH'
  | 'DIPLOMA'
  | 'VOCATIONAL'
  | 'GRADUATE'
  | 'POST_GRADUATE'
  | 'DOCTORATE';

export interface User {
  id: string;
  fullName: string;
  email?: string | null;
  phone: string;
  role: UserRole;
  status?: UserStatus;
  createdAt?: string;
}

export interface CitizenProfile {
  id?: string;
  userId?: string;
  district: string;
  block?: string | null;
  age: number;
  gender: GenderType;
  socialCategory?: SocialCategory;
  isBiharResident: boolean;
  education: EducationLevel | string;
  occupation?: string | null;
  annualIncome: number;
  landHoldingAcres?: number;
  isDifferentlyAbled?: boolean;
  skills?: string[];
  interests?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  code: string;
  name_en: string;
  name_hi: string;
  portal_url: string;
  contact_email?: string | null;
  contact_phone?: string | null;
}

export interface SchemeCategory {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string;
  icon?: string | null;
  description?: string | null;
}

export interface EligibilityRule {
  id?: string;
  schemeId?: string;
  group?: number;
  field: string;
  operator: string;
  value: any;
  message_hi?: string | null;
  message_en?: string | null;
  is_mandatory?: boolean;
}

export interface Scheme {
  id: string;
  slug: string;
  departmentId?: string;
  department?: Department | { name_en: string; name_hi: string; code?: string } | null;
  categoryId?: string;
  category?: SchemeCategory | { name_en: string; name_hi: string; slug?: string } | null;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  benefits_en: string;
  benefits_hi: string;
  application_mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  official_portal_url: string;
  official_guideline_url?: string | null;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
  last_verified_date: string;
  verified_by?: string | null;
  version?: string;
  required_documents?: string[];
  rules?: EligibilityRule[];
}

export interface RuleDetail {
  field: string;
  operator: string;
  expected: any;
  actual: any;
  message_hi: string;
}

export interface SchemeEvaluationResult {
  schemeId: string;
  schemeSlug: string;
  title_en: string;
  title_hi: string;
  status: 'POTENTIALLY_ELIGIBLE' | 'LIKELY_NOT_ELIGIBLE' | 'NEEDS_VERIFICATION';
  matchScore: number;
  passedRules: RuleDetail[];
  failedRules: RuleDetail[];
  missingRules: RuleDetail[];
  officialPortalUrl: string;
  benefits_hi?: string;
  benefits_en?: string;
  requiredDocuments?: string[];
}

export interface EligibilityCheckResponse {
  success: boolean;
  totalEvaluated: number;
  summary: {
    potentiallyEligibleCount: number;
    needsVerificationCount: number;
    likelyNotEligibleCount: number;
  };
  results: {
    potentiallyEligible: SchemeEvaluationResult[];
    needsVerification: SchemeEvaluationResult[];
    likelyNotEligible: SchemeEvaluationResult[];
  };
}

export interface CareerPath {
  id: string;
  slug: string;
  title_en: string;
  title_hi: string;
  industry: string;
  min_education: string;
  avg_starting_salary_inr: number;
  growth_prospects: string;
  description_en?: string | null;
  description_hi?: string | null;
  required_skills?: string[];
  bsdm_training_path?: string[];
  matchScore?: number;
  matchingSkills?: string[];
  missingSkills?: string[];
}

export interface AuditLog {
  id: string;
  actorId?: string | null;
  actor?: { id: string; fullName: string; email?: string; role: string } | null;
  action: string;
  entityName: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  timestamp: string;
}

export interface AnalyticsData {
  metrics: {
    totalUsers: number;
    totalSchemes: number;
    totalCareers: number;
    totalEligibilityChecks: number;
  };
  categoryDistribution?: Record<string, number>;
  recentAuditLogs?: AuditLog[];
}
