const { loadSeedData } = require('./seedLoader');
const bcrypt = require('bcryptjs');

class DatabaseStore {
  constructor() {
    this.users = [];
    this.profiles = new Map(); // userId -> profile
    this.departments = [];
    this.categories = [];
    this.schemes = [];
    this.rules = [];
    this.careers = [];
    this.eligibilityLogs = [];
    this.auditLogs = [];
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    const seed = loadSeedData();
    this.departments = [...seed.departments];
    this.categories = [...seed.categories];
    this.schemes = [...seed.schemes];
    this.rules = [...seed.rules];
    this.careers = [...seed.careers];

    // Seed default admin and sample test citizen
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@Bihar2026', salt);
    const citizenPasswordHash = await bcrypt.hash('Citizen@123', salt);

    this.users = [
      {
        id: 'usr-admin-001',
        fullName: 'Bihar Sahayak Admin',
        email: 'admin@biharsahayak.gov.in',
        phone: '9999900001',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-citizen-001',
        fullName: 'Ramesh Kumar',
        email: 'ramesh.kumar@example.com',
        phone: '9876543210',
        passwordHash: citizenPasswordHash,
        role: 'CITIZEN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      }
    ];

    this.profiles.set('usr-citizen-001', {
      id: 'prof-citizen-001',
      userId: 'usr-citizen-001',
      district: 'Patna',
      block: 'Danapur',
      age: 21,
      gender: 'MALE',
      socialCategory: 'EBC',
      isBiharResident: true,
      education: '12TH_PASS',
      occupation: 'STUDENT',
      annualIncome: 120000,
      landHoldingAcres: 0.5,
      isDifferentlyAbled: false,
      skills: ['Basic Computer', 'Hindi Typing'],
      interests: ['Information Technology', 'Civil Services'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    this.isInitialized = true;
    console.log(`[DATABASE] Initialized with ${this.schemes.length} schemes, ${this.departments.length} departments, ${this.careers.length} careers.`);
  }

  // Users
  findUserByEmailOrPhone(identifier) {
    return this.users.find(u => u.email === identifier || u.phone === identifier);
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createUser(user) {
    this.users.push(user);
    return user;
  }

  // Profile
  getProfileByUserId(userId) {
    return this.profiles.get(userId) || null;
  }

  saveProfile(userId, profileData) {
    const existing = this.profiles.get(userId) || { id: `prof-${Date.now()}`, userId, createdAt: new Date().toISOString() };
    const updated = {
      ...existing,
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    this.profiles.set(userId, updated);
    return updated;
  }

  // Schemes
  getSchemes(filters = {}) {
    let result = [...this.schemes];

    if (filters.category) {
      const cat = this.categories.find(c => c.slug === filters.category || c.id === filters.category);
      if (cat) {
        result = result.filter(s => s.category_id === cat.id);
      }
    }

    if (filters.department) {
      const dept = this.departments.find(d => d.code === filters.department || d.id === filters.department);
      if (dept) {
        result = result.filter(s => s.department_id === dept.id);
      }
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(s =>
        s.title_en.toLowerCase().includes(query) ||
        s.title_hi.toLowerCase().includes(query) ||
        s.description_en.toLowerCase().includes(query) ||
        s.description_hi.toLowerCase().includes(query)
      );
    }

    if (filters.status) {
      result = result.filter(s => s.status === filters.status);
    }

    return result;
  }

  getSchemeBySlugOrId(slugOrId) {
    const scheme = this.schemes.find(s => s.slug === slugOrId || s.id === slugOrId);
    if (!scheme) return null;

    const department = this.departments.find(d => d.id === scheme.department_id);
    const category = this.categories.find(c => c.id === scheme.category_id);
    const ruleset = this.rules.find(r => r.scheme_id === scheme.id || r.scheme_slug === scheme.slug);

    return {
      ...scheme,
      department,
      category,
      rules: ruleset ? ruleset.rules : []
    };
  }

  updateSchemeStatus(schemeId, status, verifierId) {
    const index = this.schemes.findIndex(s => s.id === schemeId || s.slug === schemeId);
    if (index === -1) return null;

    const oldScheme = { ...this.schemes[index] };
    this.schemes[index] = {
      ...this.schemes[index],
      status,
      last_verified_date: new Date().toISOString().split('T')[0],
      verified_by: verifierId
    };

    this.logAudit({
      actorId: verifierId,
      action: 'SCHEME_STATUS_UPDATED',
      entityName: 'Scheme',
      entityId: schemeId,
      oldValue: { status: oldScheme.status },
      newValue: { status }
    });

    return this.schemes[index];
  }

  // Rules
  getRulesBySchemeId(schemeId) {
    const ruleset = this.rules.find(r => r.scheme_id === schemeId || r.scheme_slug === schemeId);
    return ruleset ? ruleset.rules : [];
  }

  // Careers
  getCareers(filters = {}) {
    let list = [...this.careers];
    if (filters.industry) {
      list = list.filter(c => c.industry.toLowerCase() === filters.industry.toLowerCase());
    }
    return list;
  }

  getCareerBySlugOrId(slugOrId) {
    return this.careers.find(c => c.slug === slugOrId || c.id === slugOrId) || null;
  }

  // Audit Logs
  logAudit(entry) {
    const log = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.auditLogs.unshift(log);
    return log;
  }

  getAuditLogs(limit = 50) {
    return this.auditLogs.slice(0, limit);
  }
}

const db = new DatabaseStore();

module.exports = db;
