const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class DatabaseStore {
  constructor() {
    this.prisma = prisma;
  }

  async init() {
    try {
      await this.prisma.$connect();
      const schemeCount = await this.prisma.scheme.count();
      const deptCount = await this.prisma.department.count();
      const careerCount = await this.prisma.careerPath.count();
      console.log(`[DATABASE - SUPABASE] Connected! Loaded ${schemeCount} schemes, ${deptCount} departments, ${careerCount} careers from cloud PostgreSQL.`);
    } catch (err) {
      console.error('[DATABASE - SUPABASE ERROR]', err.message);
    }
  }

  // Users
  async findUserByEmailOrPhone(identifier) {
    if (!identifier) return null;
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });
  }

  async findUserById(id) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async createUser(userData) {
    return this.prisma.user.create({
      data: userData
    });
  }

  // Citizen Profile
  async getProfileByUserId(userId) {
    return this.prisma.citizenProfile.findUnique({
      where: { userId }
    });
  }

  async saveProfile(userId, profileData) {
    const mappedEdu = profileData.education === '10TH_PASS' 
      ? 'PASS_10TH' 
      : (profileData.education === '12TH_PASS' ? 'PASS_12TH' : profileData.education);

    return this.prisma.citizenProfile.upsert({
      where: { userId },
      update: {
        district: profileData.district,
        block: profileData.block || null,
        age: profileData.age,
        gender: profileData.gender,
        socialCategory: profileData.socialCategory || 'GENERAL',
        isBiharResident: profileData.isBiharResident !== undefined ? profileData.isBiharResident : true,
        education: mappedEdu,
        occupation: profileData.occupation || null,
        annualIncome: profileData.annualIncome || 0,
        landHoldingAcres: profileData.landHoldingAcres || 0,
        isDifferentlyAbled: profileData.isDifferentlyAbled || false,
        skills: profileData.skills || [],
        interests: profileData.interests || []
      },
      create: {
        userId,
        district: profileData.district,
        block: profileData.block || null,
        age: profileData.age,
        gender: profileData.gender,
        socialCategory: profileData.socialCategory || 'GENERAL',
        isBiharResident: profileData.isBiharResident !== undefined ? profileData.isBiharResident : true,
        education: mappedEdu,
        occupation: profileData.occupation || null,
        annualIncome: profileData.annualIncome || 0,
        landHoldingAcres: profileData.landHoldingAcres || 0,
        isDifferentlyAbled: profileData.isDifferentlyAbled || false,
        skills: profileData.skills || [],
        interests: profileData.interests || []
      }
    });
  }

  // Schemes
  async getSchemes(filters = {}) {
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.category) {
      const cat = await this.prisma.schemeCategory.findFirst({
        where: { OR: [{ slug: filters.category }, { id: filters.category }] }
      });
      if (cat) where.categoryId = cat.id;
    }

    if (filters.department) {
      const dept = await this.prisma.department.findFirst({
        where: { OR: [{ code: filters.department }, { id: filters.department }] }
      });
      if (dept) where.departmentId = dept.id;
    }

    if (filters.search) {
      where.OR = [
        { title_en: { contains: filters.search, mode: 'insensitive' } },
        { title_hi: { contains: filters.search, mode: 'insensitive' } },
        { description_en: { contains: filters.search, mode: 'insensitive' } },
        { description_hi: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    return this.prisma.scheme.findMany({
      where,
      include: {
        department: true,
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSchemeBySlugOrId(slugOrId) {
    return this.prisma.scheme.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      },
      include: {
        department: true,
        category: true,
        rules: true
      }
    });
  }

  async getAllRules() {
    return this.prisma.eligibilityRule.findMany();
  }

  async getCategories() {
    return this.prisma.schemeCategory.findMany();
  }

  async getDepartments() {
    return this.prisma.department.findMany();
  }

  async updateSchemeStatus(schemeId, status, verifierId) {
    const oldScheme = await this.getSchemeBySlugOrId(schemeId);
    if (!oldScheme) return null;

    const updated = await this.prisma.scheme.update({
      where: { id: oldScheme.id },
      data: {
        status,
        last_verified_date: new Date().toISOString().split('T')[0],
        verified_by: verifierId
      }
    });

    await this.logAudit({
      actorId: verifierId,
      action: 'SCHEME_STATUS_UPDATED',
      entityName: 'Scheme',
      entityId: oldScheme.id,
      oldValue: { status: oldScheme.status },
      newValue: { status }
    });

    return updated;
  }

  // Careers
  async getCareers(filters = {}) {
    const where = {};
    if (filters.industry) {
      where.industry = { equals: filters.industry, mode: 'insensitive' };
    }
    return this.prisma.careerPath.findMany({ where });
  }

  async getCareerBySlugOrId(slugOrId) {
    return this.prisma.careerPath.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      }
    });
  }

  // Eligibility Check Logs
  async logEligibilityCheck(data) {
    return this.prisma.eligibilityCheckLog.create({
      data: {
        userId: data.userId || null,
        totalEvaluated: data.totalEvaluated,
        eligibleCount: data.eligibleCount,
        matchedSchemes: data.matchedSchemes || []
      }
    });
  }

  async getEligibilityLogs(userId) {
    return this.prisma.eligibilityCheckLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' }
    });
  }

  // Audit Logs
  async logAudit(entry) {
    return this.prisma.auditLog.create({
      data: {
        actorId: entry.actorId || null,
        action: entry.action,
        entityName: entry.entityName,
        entityId: entry.entityId,
        oldValue: entry.oldValue || null,
        newValue: entry.newValue || null
      }
    });
  }

  async getAuditLogs(limit = 50) {
    return this.prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        actor: {
          select: { id: true, fullName: true, email: true, role: true }
        }
      }
    });
  }

  async getAnalyticsSummary() {
    const [totalUsers, totalSchemes, totalCareers, totalChecks] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.scheme.count(),
      this.prisma.careerPath.count(),
      this.prisma.eligibilityCheckLog.count()
    ]);

    const categories = await this.prisma.schemeCategory.findMany({
      include: {
        _count: {
          select: { schemes: true }
        }
      }
    });

    const categoryDistribution = {};
    categories.forEach(c => {
      categoryDistribution[c.name_en] = c._count.schemes;
    });

    return {
      totalUsers,
      totalSchemes,
      totalCareers,
      totalEligibilityChecks: totalChecks,
      categoryDistribution
    };
  }
}

const db = new DatabaseStore();

module.exports = db;
