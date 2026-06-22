import * as activityService from "../services/activity.service.js";

// Couche HTTP

export const getActivities = async (req, res) => {
  const result = await activityService.getActivities(req.user?.id);
  res.json(result);
};

export const addActivity = async (req, res) => {
  const { action, details } = req.body;
  const result = await activityService.addActivity(req.user?.id, { action, details });
  res.status(201).json(result);
};

export default { getActivities, addActivity };
