import { Router } from "express";
import authRouter from "./auth.route";
import publicRouter from "./public.route";
import adminRouter from "./admin.route";
import { requireAuth } from "../middlewares/auth.middleware";

export const router = Router();

router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

router.use("/auth", authRouter);
router.use("/public", publicRouter);
router.use("/admin", requireAuth, adminRouter);