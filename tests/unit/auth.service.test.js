import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcryptjs from 'bcryptjs';

// On isole le service de la base : les repositories et l'email sont mockés.
vi.mock('../../backend/repositories/user.repository.js');
vi.mock('../../backend/repositories/portfolio.repository.js');
vi.mock('../../backend/utils/email.js');

import * as userRepository from '../../backend/repositories/user.repository.js';
import * as portfolioRepository from '../../backend/repositories/portfolio.repository.js';
import * as authService from '../../backend/services/auth.service.js';

describe('auth.service (unitaire, repositories mockés)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('rejette si un champ est manquant', async () => {
      await expect(authService.register({ name: 'A', email: '', password: 'secret1' }))
        .rejects.toMatchObject({ status: 400 });
    });

    it('rejette un mot de passe trop court', async () => {
      await expect(authService.register({ name: 'A', email: 'a@b.c', password: '123' }))
        .rejects.toMatchObject({ status: 400 });
    });

    it('rejette un email déjà utilisé', async () => {
      userRepository.existsByEmail.mockResolvedValue(true);
      await expect(authService.register({ name: 'A', email: 'a@b.c', password: 'secret1' }))
        .rejects.toMatchObject({ status: 400, message: 'Email déjà utilisé' });
    });

    it('crée l\'utilisateur + le portfolio et renvoie un token', async () => {
      userRepository.existsByEmail.mockResolvedValue(false);
      userRepository.create.mockResolvedValue();
      portfolioRepository.createWithId.mockResolvedValue();

      const result = await authService.register({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'secret1',
      });

      expect(result).toMatchObject({ email: 'jane@example.com', name: 'Jane Doe', role: 'user' });
      expect(result.token).toBeTypeOf('string');
      expect(userRepository.create).toHaveBeenCalledOnce();
      expect(portfolioRepository.createWithId).toHaveBeenCalledOnce();
    });
  });

  describe('login', () => {
    it('rejette (401) si l\'utilisateur est introuvable', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      await expect(authService.login('absent@example.com', 'secret1'))
        .rejects.toMatchObject({ status: 401 });
    });

    it('rejette (401) si le mot de passe est faux', async () => {
      const hash = await bcryptjs.hash('bonmotdepasse', 10);
      userRepository.findByEmail.mockResolvedValue({ id: '1', email: 'a@b.c', password: hash, role: 'user' });
      await expect(authService.login('a@b.c', 'mauvais'))
        .rejects.toMatchObject({ status: 401 });
    });

    it('renvoie un token quand les identifiants sont valides', async () => {
      const hash = await bcryptjs.hash('bonmotdepasse', 10);
      userRepository.findByEmail.mockResolvedValue({ id: '1', name: 'A', email: 'a@b.c', password: hash, role: 'user' });

      const result = await authService.login('a@b.c', 'bonmotdepasse');
      expect(result.token).toBeTypeOf('string');
      expect(result).toMatchObject({ userId: '1', email: 'a@b.c', role: 'user' });
    });
  });
});
