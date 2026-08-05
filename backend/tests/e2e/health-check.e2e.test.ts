import request from 'supertest';
import express from 'express';

const app = express();
app.get('/health', (req, res) => {
  res.json({ status: 'online', service: 'pharmadash-api', version: '1.0.0' });
});

describe('Health Check', () => {
  it('should return 200 on /health', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('online');
  });
});
