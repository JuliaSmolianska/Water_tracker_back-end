import express from "express";
import userController from "../../controllers/user_controller.js"
import { isEmptyBody } from "../../middlewares/isEmptyBody.js";
import { validateBody } from "../../decorator/validateBody.js";
import {
  userRegisterSchema,
  userEmailSchema,
  userLoginSchema
} from "../../models/User.js"
import authenticate from "../../middlewares/authenticate.js";
import upload from "../../middlewares/upload.js";

const userRouter = express.Router();

userRouter.post("/register", isEmptyBody, validateBody(userRegisterSchema), userController.register);

userRouter.get("/verify/:verificationToken", userController.verify);

userRouter.post("/verify", isEmptyBody, validateBody(userEmailSchema), userController.resendVarify)

userRouter.post("/login", isEmptyBody, validateBody(userLoginSchema), userController.login)

userRouter.get("/current", authenticate, userController.current);

userRouter.post("/logout", authenticate, userController.logout);

userRouter.patch("/avatars", authenticate, upload.single("avatarURL"), userController.updateAvatar);

export default userRouter;