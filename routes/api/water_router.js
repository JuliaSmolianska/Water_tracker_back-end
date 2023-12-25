import express from "express";
import waterController from "../../controllers/water_controller.js";
import { isEmptyBody } from "../../middlewares/isEmptyBody.js";
import { isValidId } from "../../middlewares/isValidId.js";
import { validateBody } from "../../decorator/validateBody.js";
import { addWaterSchema, updateWaterSchema } from "../../models/Water.js"
import authenticate from "../../middlewares/authenticate.js";

const waterRouter = express.Router();

waterRouter.use(authenticate);

waterRouter.get('/today', waterController.getAllWaterToday);

waterRouter.get('/month', waterController.getAllWaterMonth);

waterRouter.post('/today', isEmptyBody, validateBody(addWaterSchema), waterController.addWaterIntake);

waterRouter.patch('/today/:recordId', isValidId, isEmptyBody, validateBody(updateWaterSchema), waterController.updateWaterRecordId);

waterRouter.delete('/today/:recordId', isValidId, waterController.deleteWaterRecordId)

export default waterRouter;
