import * as mediaRepository from "../repositories/media.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { unauthorized, notFound } from "../utils/httpError.js";

/**
 * Crée ou met à jour les médias du portfolio (réseaux sociaux, image de profil,
 * CV, sites web).
 * @param {string} userId - Identifiant de l'utilisateur connecté.
 * @param {object} data - Données médias (linkedin, github, twitter, websites,
 *   profileImage, cvFile, cvFileName).
 * @returns {Promise<{media: object}>} Les médias enregistrés.
 * @throws {HttpError} 401 si non authentifié, 404 si l'utilisateur n'a pas de portfolio.
 */
export const updateMedia = async (userId, data) => {
  if (!userId) throw unauthorized("Non authentifié");

  const { linkedin, github, twitter, websites, profileImage, cvFile, cvFileName } = data;

  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  const existing = await mediaRepository.findByPortfolioId(portfolioId);
  const payload = { linkedin, github, twitter, profileImage, cvFile, cvFileName };

  const media = existing
    ? await mediaRepository.update(portfolioId, payload)
    : await mediaRepository.create(portfolioId, payload);

  if (Array.isArray(websites)) {
    await mediaRepository.replaceWebsites(media.id, websites);
  }

  const websitesRows = await mediaRepository.findWebsites(media.id);

  return {
    media: {
      linkedin: media.linkedin || '',
      github: media.github || '',
      twitter: media.twitter || '',
      profileImage: media.profile_image || '',
      cvFile: media.cv_file || '',
      cvFileName: media.cv_file_name || '',
      websites: websitesRows.map((w) => w.url),
      links: []
    }
  };
};
