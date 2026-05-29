const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../index');

// Mock mongoose to avoid actual DB connections during test
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue({ connection: { host: 'localhost' } }),
    model: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }),
      findById: jest.fn().mockResolvedValue(null),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
      updateMany: jest.fn().mockResolvedValue(null)
    }),
    Schema: actualMongoose.Schema
  };
});

describe('API Health Check', () => {
  afterAll((done) => {
    server.close(done);
  });

  it('should return status ok for health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
