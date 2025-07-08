import request from 'supertest';
import express from 'express';
import boardRoutes from '../routes/board.js';

const app = express();
app.use(express.json());
app.use('/api/boards', boardRoutes);

describe('Board Controller', () => {
  it('should return 400 when creating a board without name', async () => {
    const res = await request(app).post('/api/boards').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
