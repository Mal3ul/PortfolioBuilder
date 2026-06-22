import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../backend/middleware/auth.js';
import { JWT_SECRET } from '../../backend/config.js';

const mockRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

describe('verifyToken (authentification JWT)', () => {
  it('401 quand aucun token n\'est fourni', () => {
    const res = mockRes();
    const next = vi.fn();
    verifyToken({ headers: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('401 quand le token est invalide', () => {
    const res = mockRes();
    const next = vi.fn();
    verifyToken({ headers: { authorization: 'Bearer pas.un.token' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('appelle next() et renseigne req.user avec un token valide', () => {
    const token = jwt.sign({ id: '1', role: 'user' }, JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = vi.fn();

    verifyToken(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toMatchObject({ id: '1', role: 'user' });
  });
});
