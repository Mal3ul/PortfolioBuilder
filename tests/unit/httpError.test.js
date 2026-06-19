import { describe, it, expect } from 'vitest';
import {
  HttpError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
} from '../../backend/utils/httpError.js';

// Tests UNITAIRES purs (aucune dépendance externe).
describe('httpError', () => {
  it('HttpError porte un status et un message', () => {
    const err = new HttpError(418, "Je suis une théière");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('HttpError');
    expect(err.status).toBe(418);
    expect(err.message).toBe("Je suis une théière");
  });

  it('les fabriques renvoient le bon code HTTP', () => {
    expect(badRequest('x').status).toBe(400);
    expect(unauthorized('x').status).toBe(401);
    expect(forbidden('x').status).toBe(403);
    expect(notFound('x').status).toBe(404);
  });

  it('chaque fabrique produit une HttpError avec le message fourni', () => {
    const err = badRequest('champ manquant');
    expect(err).toBeInstanceOf(HttpError);
    expect(err.message).toBe('champ manquant');
  });
});
