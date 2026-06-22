import { describe, it, expect, beforeEach, vi } from 'vitest';

// Repositories mockés : on teste la logique métier, pas la base.
vi.mock('../../backend/repositories/project.repository.js');
vi.mock('../../backend/repositories/portfolio.repository.js');

import * as projectRepository from '../../backend/repositories/project.repository.js';
import * as portfolioRepository from '../../backend/repositories/portfolio.repository.js';
import * as projectService from '../../backend/services/project.service.js';

describe('project.service (unitaire, repositories mockés)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProjects', () => {
    it('rejette (404) si l\'utilisateur n\'a pas de portfolio', async () => {
      portfolioRepository.findIdByUserId.mockResolvedValue(null);
      await expect(projectService.getProjects('u1')).rejects.toMatchObject({ status: 404 });
    });

    it('renvoie les projets avec les technologies parsées', async () => {
      portfolioRepository.findIdByUserId.mockResolvedValue('p1');
      projectRepository.findByPortfolioId.mockResolvedValue([
        { id: '1', technologies: '["React","Node"]' },
      ]);

      const result = await projectService.getProjects('u1');
      expect(result[0].technologies).toEqual(['React', 'Node']);
    });
  });

  describe('updateProject (sécurité IDOR)', () => {
    it('refuse de modifier un projet appartenant à un autre utilisateur (404)', async () => {
      portfolioRepository.findIdByUserId.mockResolvedValue('p1');
      projectRepository.findById.mockResolvedValue({ id: '10', portfolio_id: 'p999' });

      await expect(projectService.updateProject('u1', '10', { title: 'X' }))
        .rejects.toMatchObject({ status: 404 });
      expect(projectRepository.update).not.toHaveBeenCalled();
    });

    it('autorise la modification par le propriétaire', async () => {
      portfolioRepository.findIdByUserId.mockResolvedValue('p1');
      projectRepository.findById.mockResolvedValue({ id: '10', portfolio_id: 'p1' });
      projectRepository.update.mockResolvedValue({ id: '10', portfolio_id: 'p1', technologies: '[]' });

      const result = await projectService.updateProject('u1', '10', { title: 'X' });
      expect(projectRepository.update).toHaveBeenCalledOnce();
      expect(result.technologies).toEqual([]);
    });
  });

  describe('deleteProject (sécurité IDOR)', () => {
    it('refuse de supprimer le projet d\'un autre utilisateur (404)', async () => {
      portfolioRepository.findIdByUserId.mockResolvedValue('p1');
      projectRepository.findById.mockResolvedValue({ id: '10', portfolio_id: 'p999' });

      await expect(projectService.deleteProject('u1', '10')).rejects.toMatchObject({ status: 404 });
      expect(projectRepository.remove).not.toHaveBeenCalled();
    });

    it('supprime le projet du propriétaire', async () => {
      portfolioRepository.findIdByUserId.mockResolvedValue('p1');
      projectRepository.findById.mockResolvedValue({ id: '10', portfolio_id: 'p1' });
      projectRepository.remove.mockResolvedValue({ id: '10' });

      const result = await projectService.deleteProject('u1', '10');
      expect(projectRepository.remove).toHaveBeenCalledOnce();
      expect(result).toMatchObject({ message: expect.any(String) });
    });
  });
});
