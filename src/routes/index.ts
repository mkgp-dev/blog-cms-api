import { Router } from "express";
import authRouter from "./auth";
import publicRouter from "./public";
import adminRouter from "./admin";
import { requireAuth } from "../middleware/auth";

export const router = Router();

router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

router.use("/auth", authRouter);
router.use("/public", publicRouter);
router.use("/admin", requireAuth, adminRouter);