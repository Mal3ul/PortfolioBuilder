import * as skillService from "../services/skill.service.js";

// Couche HTTP : lit la requête, appelle le service, renvoie la réponse.

export const getSkills = async (req, res) => {
  const result = await skillService.getSkills(req.params.userId);
  res.json(result);
};

export const addSkill = async (req, res) => {
  const result = await skillService.addSkill(req.body.userId, req.body.name);
  res.status(201).json(result);
};

export const updateSkill = async (req, res) => {
  const result = await skillService.updateSkill(req.params.skillId, req.body.name);
  res.json(result);
};

export const updateAllSkills = async (req, res) => {
  const result = await skillService.updateAllSkills(req.user?.id, req.body.skills);
  res.json(result);
};

export const deleteSkill = async (req, res) => {
  const result = await skillService.deleteSkill(req.params.skillId);
  res.json(result);
};

export default { getSkills, addSkill, updateSkill, updateAllSkills, deleteSkill };
