const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database/db');

describe('Bihar Sahayak REST API Integration Tests', () => {
  let citizenToken = '';
  let adminToken = '';

  beforeAll(async () => {
    await db.init();
  });

  test('GET /api/v1/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.platform).toBe('Bihar Sahayak (BSeva)');
  });

  test('POST /api/v1/auth/register should register a new citizen and return token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Priya Kumari',
        phone: '9876500002',
        email: 'priya.test@example.com',
        password: 'Password123!'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    citizenToken = res.body.token;
  });

  test('POST /api/v1/auth/login should authenticate admin user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'admin@biharsahayak.gov.in',
        password: 'Admin@Bihar2026'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('ADMIN');
    adminToken = res.body.token;
  });

  test('GET /api/v1/schemes should list 25 verified schemes with pagination', async () => {
    const res = await request(app).get('/api/v1/schemes');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.total).toBe(25);
    expect(res.body.schemes.length).toBeGreaterThan(0);
  });

  test('GET /api/v1/schemes?search=student should find credit card scheme', async () => {
    const res = await request(app).get('/api/v1/schemes?search=student');
    expect(res.statusCode).toBe(200);
    expect(res.body.schemes.some(s => s.slug === 'bihar-student-credit-card-scheme')).toBe(true);
  });

  test('POST /api/v1/eligibility/check should evaluate schemes for guest profile', async () => {
    const res = await request(app)
      .post('/api/v1/eligibility/check')
      .send({
        profile: {
          isBiharResident: true,
          age: 21,
          gender: 'FEMALE',
          education: 'GRADUATE',
          socialCategory: 'SC',
          annualIncome: 80000
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalEvaluated).toBe(25);
    expect(res.body.summary.potentiallyEligibleCount).toBeGreaterThan(0);
  });

  test('POST /api/v1/careers/recommend should recommend career with skill gap analysis', async () => {
    const res = await request(app)
      .post('/api/v1/careers/recommend')
      .send({
        profile: {
          education: '12TH_PASS',
          skills: ['JavaScript', 'HTML/CSS'],
          interests: ['Information Technology']
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.recommendations[0].slug).toBe('full-stack-web-developer');
    expect(res.body.recommendations[0].matchingSkills).toContain('HTML/CSS');
    expect(res.body.recommendations[0].missingSkills).toContain('React');
  });

  test('GET /api/v1/admin/analytics should be protected and return data for ADMIN', async () => {
    const unauthRes = await request(app).get('/api/v1/admin/analytics');
    expect(unauthRes.statusCode).toBe(401);

    const authRes = await request(app)
      .get('/api/v1/admin/analytics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(authRes.statusCode).toBe(200);
    expect(authRes.body.success).toBe(true);
    expect(authRes.body.metrics.totalSchemes).toBe(25);
  });
});
