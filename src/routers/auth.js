import { Router } from "express";

import { validateBody } from "../utils/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import { loginUserSchema,registerUserSchema, requestResetEmailSchema, resetPasswordSchema } from "../validation/auth.js";

import {
    registerUserController, loginUserController,
    logoutUserController,
    refreshUserController,
    requestResetEmailController ,
    resetPasswordController
} from "../controllers/auth.js";




const router = Router();

router.post(
    "/register",
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController),
);
router.post(
    "/send-reset-email",
     validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController )
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
router.post(
    "/login",
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController),
);


router.post(
    "/refresh",
    ctrlWrapper(refreshUserController)
);

router.post(
    "/logout",
    ctrlWrapper(logoutUserController)
);

export default router;


