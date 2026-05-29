const request = require('supertest');
const { app, server } = require('../index');

// Mock Notification model
jest.mock('../models/Notification', () => {
  return {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { _id: '1', message: 'Test notification', read: false }
      ])
    }),
    findByIdAndUpdate: jest.fn().mockResolvedValue({ _id: '1', message: 'Test notification', read: true }),
    updateMany: jest.fn().mockResolvedValue({ modifiedCount: 1 })
  };
});

describe('Notification API', () => {
  afterAll((done) => {
    server.close(done);
  });

  it('GET /api/notifications should return list of notifications', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0].message).toBe('Test notification');
  });

  it('PATCH /api/notifications/:id/read should mark notification as read', async () => {
    const res = await request(app).patch('/api/notifications/1/read');
    expect(res.statusCode).toEqual(200);
    expect(res.body.read).toBe(true);
  });

  it('PATCH /api/notifications/read-all should mark all as read', async () => {
    const res = await request(app).patch('/api/notifications/read-all');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
