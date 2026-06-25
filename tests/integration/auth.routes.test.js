import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../backend/app.js';
import pool from '../../backend/config/database.js';

// Tests d'INTÉGRATION / NON-RÉGRESSION : parcours d'auth complet contre une vraie
// base PostgreSQL éphémère (fournie par docker-utils.yaml : service test-db).
// Sert de garde-fou : toute régression sur register/login/me casse ces tests.

const email = `pbtest_${Date.now()}@example.com`;
const password = 'secret123!';
let token;

beforeAll(async () => {
  // Vérifie que la base répond (sinon les tests d'intégration n'ont pas de sens).
  await pool.query('SELECT 1');
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', [email]).catch(() => {});
  await pool.end();
});

describe('POST /api/auth/register', () => {
  it('crée un compte et renvoie un token (201)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTypeOf('string');
    expect(res.body).toMatchObject({ email, role: 'user' });
  });

  it('refuse un email déjà utilisé (400)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password });

    expect(res.status).toBe(400);
  });

  it('refuse un mot de passe trop court (400)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'X', email: `short_${Date.now()}@example.com`, password: '123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('refuse un mauvais mot de passe (401)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'mauvais' });

    expect(res.status).toBe(401);
  });

  it('connecte avec les bons identifiants (200) et renvoie un token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf('string');
    token = res.body.token;
  });
});

describe('GET /api/auth/me', () => {
  it('refuse sans token (401)', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('renvoie l\'utilisateur courant avec un token valide (200)', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
  });
});
