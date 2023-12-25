import express from "express";
import userController from "../../controllers/user_controller.js"
import { isEmptyBody } from "../../middlewares/isEmptyBody.js";
import { validateBody } from "../../decorator/validateBody.js";
import {
  userRegisterSchema,
  userLoginSchema,
  userNormWaterSchema,
  userUpdateSchema
} from "../../models/User.js"
import authenticate from "../../middlewares/authenticate.js";
import upload from "../../middlewares/upload.js";

const userRouter = express.Router();

userRouter.post("/register", isEmptyBody, validateBody(userRegisterSchema), userController.register);

userRouter.post("/login", isEmptyBody, validateBody(userLoginSchema), userController.login)

userRouter.post("/logout", authenticate, userController.logout);

userRouter.patch("/avatar", authenticate, upload.single("avatarURL"), userController.updateAvatar);

userRouter.get("/:userId", authenticate, userController.currentUser);

userRouter.patch("/:userId", authenticate, isEmptyBody, validateBody(userUpdateSchema), userController.updateUser);

userRouter.patch("/waterNorm", authenticate, isEmptyBody, validateBody(userNormWaterSchema), userController.updateWaterNorm);

export default userRouter;