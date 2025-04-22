import { Router } from "express";
import contactsRouter from "./contacts.js";
import authRouter from "./auth.js";
import cookieParser from "cookie-parser";

const router = Router();

router.use("/contacts", contactsRouter);
router.use("/auth", authRouter);
router.use(cookieParser());

export default router;
