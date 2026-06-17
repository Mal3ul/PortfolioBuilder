import * as mediaService from "../services/media.service.js";

// Couche HTTP : lit la requête, appelle le service, renvoie la réponse.

export const updateMedia = async (req, res) => {
  const data = req.body.media || req.body;
  const result = await mediaService.updateMedia(req.user?.id, data);
  res.json(result);
};

export default { updateMedia };
