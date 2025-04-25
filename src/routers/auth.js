import { Router } from "express";

import { validateBody } from "../utils/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import { loginUserSchema,registerUserSchema } from "../validation/auth.js";

import {
    registerUserController, loginUserController,
    logoutUserController,
    refreshUserController
} from "../controllers/auth.js";




const router = Router();

router.post(
    "/register",
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController),
);

router.post(
    "/login",
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController),
);

router.post(
    "/logout",
    ctrlWrapper(logoutUserController)
);

router.post(
    "/refresh",
    ctrlWrapper(refreshUserController)
);

export default router;
