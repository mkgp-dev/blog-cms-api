import { Router } from "express";
import { authRateLimit } from "../middlewares/limit.middleware";
import { login } from "../controllers/auth.controller";

const router = Router();

router.post("/login", authRateLimit, login);

export default router;