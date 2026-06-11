const request = require('supertest');
const express = require('express');
const cors = require('cors');
require('express-async-errors');
require('dotenv').config();

// Build a test version of the app
const partsRouter = require('../src/routes/parts');
const categoriesRouter = require('../src/routes/categories');
const authRouter = require('../src/routes/auth');
const errorHandler = require('../src/middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/parts', partsRouter);
app.use('/api/categories', categoriesRouter);
app.use(errorHandler);

let token;

// Login before all tests to get a token
beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@demo.com', password: 'password123' });
  token = res.body.token;
});

// AUTH TESTS
describe('POST /api/auth/login', () => {
  it('returns a token with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@demo.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@demo.com', password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });

  it('rejects request with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@demo.com' });
    expect(res.statusCode).toBe(400);
  });
});

// PARTS TESTS
describe('GET /api/parts', () => {
  it('returns list of parts with valid token', async () => {
    const res = await request(app)
      .get('/api/parts')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('rejects request without token', async () => {
    const res = await request(app).get('/api/parts');
    expect(res.statusCode).toBe(401);
  });

  it('filters parts by search query', async () => {
    const res = await request(app)
      .get('/api/parts?search=brake')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach(part => {
      expect(part.name.toLowerCase()).toMatch(/brake/);
    });
  });
});

describe('GET /api/parts/low-stock', () => {
  it('returns only parts at or below reorder level', async () => {
    const res = await request(app)
      .get('/api/parts/low-stock')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(part => {
      expect(part.stock_qty).toBeLessThanOrEqual(part.reorder_level);
    });
  });
});

describe('POST /api/parts', () => {
  it('creates a new part successfully', async () => {
    const uniquePartNumber = `TEST-${Date.now()}`;
    const res = await request(app)
      .post('/api/parts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Brake Pad',
        part_number: uniquePartNumber,
        price: 19.99,
        stock_qty: 10,
        reorder_level: 3,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Brake Pad');
  });

  it('rejects a part with missing required fields', async () => {
    const res = await request(app)
      .post('/api/parts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Incomplete Part' });
    expect(res.statusCode).toBe(400);
  });


  it('rejects a part with missing required fields', async () => {
    const res = await request(app)
      .post('/api/parts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Incomplete Part' });
    expect(res.statusCode).toBe(400);
  });
});

describe('PUT /api/parts/:id', () => {
  it('updates an existing part', async () => {
    // First get a part id
    const parts = await request(app)
      .get('/api/parts')
      .set('Authorization', `Bearer ${token}`);
    const part = parts.body[0];

    const res = await request(app)
      .put(`/api/parts/${part.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...part, stock_qty: 99 });
    expect(res.statusCode).toBe(200);
    expect(res.body.stock_qty).toBe(99);
  });
});

describe('DELETE /api/parts/:id', () => {
  it('deletes a part successfully', async () => {
    // Create a fresh part to delete
    const created = await request(app)
      .post('/api/parts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Part To Delete',
        part_number: 'DEL-001',
        price: 9.99,
        stock_qty: 5,
        reorder_level: 2,
      });

    const res = await request(app)
      .delete(`/api/parts/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

// CATEGORIES TESTS
describe('GET /api/categories', () => {
  it('returns list of categories', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});