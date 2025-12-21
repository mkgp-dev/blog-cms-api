import { Router } from "express";
import { authRateLimit } from "../middleware/limit";
import { login } from "../controllers/auth";

const authRouter = Router();

authRouter.post("/login", authRateLimit, login);

export default authRouter;