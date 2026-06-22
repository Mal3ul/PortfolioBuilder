import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../backend/app.js';

// Non-régression + sécurité : les routes d'écriture de projets doivent exiger
// un token. Ces cas s'arrêtent au middleware (401) et ne touchent pas la base,
// donc ils tournent partout, y compris en CI sans PostgreSQL.
describe('Sécurité des routes /api/projects (sans token)', () => {
  it('POST /api/projects refuse sans token (401)', async () => {
    const res = await request(app).post('/api/projects').send({ title: 'X' });
    expect(res.status).toBe(401);
  });

  it('PUT /api/projects/:id refuse sans token (401)', async () => {
    const res = await request(app).put('/api/projects/123').send({ title: 'X' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/projects/:id refuse sans token (401)', async () => {
    const res = await request(app).delete('/api/projects/123');
    expect(res.status).toBe(401);
  });
});
