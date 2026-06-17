import * as projectService from "../services/project.service.js";

// Couche HTTP : lit la requête, appelle le service, renvoie la réponse.

export const getProjects = async (req, res) => {
  const result = await projectService.getProjects(req.params.userId);
  res.json(result);
};

export const addProject = async (req, res) => {
  const { title, description, technologies, githubUrl, liveUrl, imageUrl } = req.body;
  const result = await projectService.addProject(req.body.userId, {
    title, description, technologies, githubUrl, liveUrl, imageUrl
  });
  res.status(201).json(result);
};

export const updateProject = async (req, res) => {
  const { title, description, technologies, githubUrl, liveUrl, imageUrl } = req.body;
  const result = await projectService.updateProject(req.body.userId, req.params.projectId, {
    title, description, technologies, githubUrl, liveUrl, imageUrl
  });
  res.json(result);
};

export const deleteProject = async (req, res) => {
  const result = await projectService.deleteProject(req.body.userId, req.params.projectId);
  res.json(result);
};

export default { getProjects, addProject, updateProject, deleteProject };
