import { withTransaction } from "../config/database.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import * as projectRepository from "../repositories/project.repository.js";
import * as experienceRepository from "../repositories/experience.repository.js";
import * as educationRepository from "../repositories/education.repository.js";
import * as certificationRepository from "../repositories/certification.repository.js";
import { unauthorized, notFound } from "../utils/httpError.js";

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const parseTechnologies = (project) => ({
  ...project,
  technologies: typeof project.technologies === 'string'
    ? JSON.parse(project.technologies)
    : project.technologies
});

// Les colonnes DATE sont renvoyées par pg comme objets Date : on les reformate
// en 'yyyy-MM-dd' (format attendu par <input type="date"> et l'affichage côté front).
const toYmd = (value) => {
  if (!value) return '';
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(value).slice(0, 10);
};

// La base stocke en snake_case ; le front attend du camelCase (startDate/endDate…).
const formatExperience = (exp) => ({
  id: exp.id,
  position: exp.position,
  company: exp.company,
  startDate: toYmd(exp.start_date),
  endDate: toYmd(exp.end_date),
  description: exp.description,
  createdAt: exp.created_at
});

const formatEducation = (edu) => ({
  id: edu.id,
  diploma: edu.diploma,
  school: edu.school,
  startDate: toYmd(edu.start_date),
  endDate: toYmd(edu.end_date),
  description: edu.description,
  createdAt: edu.created_at
});

const formatCertification = (cert) => ({
  ...cert,
  date: toYmd(cert.date)
});

// Met en forme les relations pour la réponse API.
const formatRelations = (relations) => ({
  skills: relations.skills.map((s) => s.skill_name),
  projects: relations.projects.map(parseTechnologies),
  experiences: relations.experiences.map(formatExperience),
  education: relations.education.map(formatEducation),
  certifications: relations.certifications.map(formatCertification),
  media: {
    linkedin: relations.media[0]?.linkedin || '',
    github: relations.media[0]?.github || '',
    twitter: relations.media[0]?.twitter || '',
    profile_image: relations.media[0]?.profile_image || '',
    profileImage: relations.media[0]?.profile_image || '',
    cvFile: relations.media[0]?.cv_file || '',
    cvFileName: relations.media[0]?.cv_file_name || '',
    websites: relations.websites.map((w) => w.url || ''),
    links: relations.links.map((l) => l.url || '')
  }
});

/**
 * Récupère le portfolio complet de l'utilisateur connecté (profil + relations).
 * Le portfolio est créé à la volée s'il n'existe pas encore.
 * @param {string} userId - Identifiant de l'utilisateur connecté.
 * @returns {Promise<object>} Le portfolio formaté pour l'API.
 * @throws {HttpError} 401 si non authentifié, 404 si le portfolio est introuvable.
 */
export const getOwnPortfolio = async (userId) => {
  if (!userId) throw unauthorized("Non authentifié");

  let portfolio = await portfolioRepository.findByUserId(userId);
  if (!portfolio) {
    portfolio = await portfolioRepository.ensureExists({ userId, firstName: 'User', lastName: '', email: '' });
  }
  if (!portfolio) throw notFound("Portfolio introuvable");

  const relations = await portfolioRepository.findRelations(portfolio.id);

  return {
    profile: {
      firstName: portfolio.first_name || '',
      lastName: portfolio.last_name || '',
      title: portfolio.title || '',
      bio: portfolio.bio || '',
      email: portfolio.email || '',
      phone: portfolio.phone || '',
      location: portfolio.location || ''
    },
    ...formatRelations(relations)
  };
};

/**
 * Récupère le portfolio public d'un utilisateur (consultation sans authentification).
 * @param {string} userId - Identifiant de l'utilisateur ciblé.
 * @returns {Promise<object>} Le portfolio formaté pour l'API.
 * @throws {HttpError} 404 si l'utilisateur ou le portfolio est introuvable.
 */
export const getPublicPortfolio = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw notFound("Utilisateur introuvable");

  let portfolio = await portfolioRepository.findByUserId(userId);
  if (!portfolio) {
    const [firstName = "", ...rest] = (user.name || "").trim().split(" ");
    portfolio = await portfolioRepository.ensureExists({
      userId,
      firstName: firstName || 'User',
      lastName: rest.join(" ").trim(),
      email: user.email
    });
  }
  if (!portfolio) throw notFound("Portfolio introuvable");

  const relations = await portfolioRepository.findRelations(portfolio.id);

  return {
    profile: {
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      title: portfolio.title || '',
      bio: portfolio.bio || '',
      email: user.email,
      phone: portfolio.phone || '',
      location: portfolio.location || ''
    },
    ...formatRelations(relations)
  };
};

/**
 * Met à jour le portfolio de l'utilisateur (profil et collections) dans une
 * transaction : projets, expériences, formations et certifications fournis
 * remplacent intégralement l'existant.
 * @param {string} userId - Identifiant de l'utilisateur connecté.
 * @param {object} data - Champs de profil et tableaux de collections à enregistrer.
 * @returns {Promise<object>} Le portfolio mis à jour.
 * @throws {HttpError} 401 si non authentifié, 404 si le portfolio est introuvable.
 */
export const updatePortfolio = async (userId, data) => {
  if (!userId) throw unauthorized("Non authentifié");

  const { firstName, lastName, title, bio, email, phone, location, projects, experiences, education, certifications } = data;

  const portfolioFinal = await withTransaction(async (client) => {
    let portfolioRow = await portfolioRepository.findByUserId(userId, client);
    if (!portfolioRow) {
      portfolioRow = await portfolioRepository.ensureExists({ userId, firstName: 'User', lastName: '', email: '' }, client);
    }
    if (!portfolioRow) throw notFound("Portfolio introuvable");

    const portfolioId = portfolioRow.id;

    const hasProfileUpdate = [firstName, lastName, title, bio, email, phone, location].some((v) => v !== undefined);
    if (hasProfileUpdate) {
      const updatedFirstName = capitalize(firstName !== undefined ? firstName : portfolioRow.first_name);
      const updatedLastName = capitalize(lastName !== undefined ? lastName : portfolioRow.last_name);

      await portfolioRepository.updateProfile(portfolioId, {
        firstName: updatedFirstName,
        lastName: updatedLastName,
        title: title !== undefined ? title : portfolioRow.title,
        bio: bio !== undefined ? bio : portfolioRow.bio,
        email: email !== undefined ? email : portfolioRow.email,
        phone: phone !== undefined ? phone : portfolioRow.phone,
        location: location !== undefined ? location : portfolioRow.location
      }, client);

      if (firstName !== undefined || lastName !== undefined) {
        await userRepository.updateName(userId, `${updatedFirstName} ${updatedLastName}`.trim());
      }
    }

    if (Array.isArray(projects)) {
      await projectRepository.deleteByPortfolio(portfolioId, client);
      for (const p of projects) {
        await projectRepository.create(portfolioId, { ...p, title: capitalize(p.title || '') }, client);
      }
    }

    if (Array.isArray(experiences)) {
      await experienceRepository.deleteByPortfolio(portfolioId, client);
      for (const exp of experiences) {
        await experienceRepository.create(portfolioId, {
          ...exp,
          position: capitalize(exp.position || ''),
          company: capitalize(exp.company || '')
        }, client);
      }
    }

    if (Array.isArray(education)) {
      await educationRepository.deleteByPortfolio(portfolioId, client);
      for (const edu of education) {
        await educationRepository.create(portfolioId, edu, client);
      }
    }

    if (Array.isArray(certifications)) {
      await certificationRepository.deleteByPortfolio(portfolioId, client);
      for (const cert of certifications) {
        await certificationRepository.create(portfolioId, cert, client);
      }
    }

    return portfolioRepository.findById(portfolioId, client);
  });

  const relations = await portfolioRepository.findRelations(portfolioFinal.id);

  return {
    message: "Portfolio mis à jour",
    profile: {
      firstName: portfolioFinal?.first_name || '',
      lastName: portfolioFinal?.last_name || '',
      title: portfolioFinal?.title || '',
      bio: portfolioFinal?.bio || '',
      email: portfolioFinal?.email || '',
      phone: portfolioFinal?.phone || '',
      location: portfolioFinal?.location || ''
    },
    projects: relations.projects.map(parseTechnologies),
    experiences: relations.experiences.map(formatExperience),
    education: relations.education.map(formatEducation),
    certifications: relations.certifications.map(formatCertification)
  };
};

/**
 * Crée ou met à jour (upsert) le profil du portfolio d'un utilisateur.
 * @param {string} userId - Identifiant de l'utilisateur.
 * @param {object} profile - Champs du profil (firstName, lastName, title, bio…).
 * @returns {Promise<{message: string}>} Message de confirmation.
 */
export const savePortfolio = async (userId, profile) => {
  await portfolioRepository.upsertProfile(userId, profile);
  return { message: "Portfolio sauvegardé" };
};
