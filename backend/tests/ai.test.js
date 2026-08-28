const request = require('supertest');
const app = require('../src/app');

describe('AI Assistant & RAG Pipeline API Tests', () => {
  it('GET /api/v1/ai/suggest should return starter prompt suggestions', async () => {
    const res = await request(app).get('/api/v1/ai/suggest?lang=hi');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.suggestions)).toBe(true);
    expect(res.body.suggestions.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/ai/chat should process student scheme query with citations', async () => {
    const res = await request(app)
      .post('/api/v1/ai/chat')
      .send({
        query: 'मुझे 12वीं पास करने के बाद आगे की पढ़ाई के लिए कौन सी छात्रवृत्ति या क्रेडिट कार्ड योजना मिलेगी?',
        language: 'hi'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.intent).toBeDefined();
    expect(res.body.response.text).toBeDefined();
    expect(Array.isArray(res.body.response.citations)).toBe(true);
    expect(res.body.response.citations.length).toBeGreaterThan(0);
    expect(res.body.response.disclaimer).toBeDefined();
  });

  it('POST /api/v1/ai/chat should handle career guidance queries with BSDM links', async () => {
    const res = await request(app)
      .post('/api/v1/ai/chat')
      .send({
        query: 'What career and skill training courses are offered for Solar and IT in Bihar?',
        language: 'en'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.intent).toBe('CAREER_GUIDANCE');
    expect(res.body.response.citations[0].sourceDepartment).toContain('Bihar Skill Development Mission');
  });

  it('POST /api/v1/ai/chat should reject empty query', async () => {
    const res = await request(app)
      .post('/api/v1/ai/chat')
      .send({ query: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
