const request = require('supertest');
const app = require('../src/app');

describe('GET /api/data', () => {
  test('responds with JSON and the expected structure', async () => {
    const res = await request(app).get('/api/data').expect(200).expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    // ensure sample structure contains A
    const names = res.body.data.map(n => n.name);
    expect(names).toContain('A');
  });
});