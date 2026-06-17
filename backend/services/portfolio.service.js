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

// Met en forme les relations pour la réponse API.
const formatRelations = (relations) => ({
  skills: relations.skills.map((s) => s.skill_name),
  projects: relations.projects.map(parseTechnologies),
  experiences: relations.experiences,
  education: relations.education,
  certifications: relations.certifications,
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

// Portfolio de l'utilisateur connecté.
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

// Portfolio public d'un utilisateur (par userId).
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

// Mise à jour complète du portfolio (profil + collections) en transaction.
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
    experiences: relations.experiences,
    education: relations.education,
    certifications: relations.certifications
  };
};

// Sauvegarde (upsert) du profil portfolio.
export const savePortfolio = async (userId, profile) => {
  await portfolioRepository.upsertProfile(userId, profile);
  return { message: "Portfolio sauvegardé" };
};
