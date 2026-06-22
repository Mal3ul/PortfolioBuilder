import { describe, it, expect, vi } from 'vitest';
import { requireRole, requireSelfOrAdmin } from '../../backend/middleware/roles.js';

// Faux objet réponse Express : status() et json() chaînables et espionnés.
const mockRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

describe('requireRole (contrôle des rôles)', () => {
  it('401 si non authentifié', () => {
    const res = mockRes();
    const next = vi.fn();
    requireRole('admin')({}, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('403 si le rôle ne correspond pas', () => {
    const res = mockRes();
    const next = vi.fn();
    requireRole('admin')({ user: { role: 'user' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('next() si le rôle est autorisé', () => {
    const res = mockRes();
    const next = vi.fn();
    requireRole('admin')({ user: { role: 'admin' } }, res, next);
    expect(next).toHaveBeenCalledOnce();
  });
});

describe('requireSelfOrAdmin (propriétaire ou admin)', () => {
  const mw = requireSelfOrAdmin({ inBody: true, paramKey: 'userId' });

  it('403 si on cible un autre utilisateur', () => {
    const res = mockRes();
    const next = vi.fn();
    mw({ user: { id: '1', role: 'user' }, body: { userId: '2' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('next() si on cible son propre compte', () => {
    const res = mockRes();
    const next = vi.fn();
    mw({ user: { id: '1', role: 'user' }, body: { userId: '1' } }, res, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it('next() si admin, même sur le compte d\'un autre', () => {
    const res = mockRes();
    const next = vi.fn();
    mw({ user: { id: '9', role: 'admin' }, body: { userId: '2' } }, res, next);
    expect(next).toHaveBeenCalledOnce();
  });
});
