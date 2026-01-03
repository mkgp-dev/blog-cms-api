import { Router } from "express";
import { apiRateLimit } from "../middlewares/limit.middleware";
import { createPostComment, getPost, listAllPost, listPostComments } from "../controllers/public.controller";

const router = Router();

router.get("/posts", apiRateLimit, listAllPost);
router.get("/posts/:id", apiRateLimit, getPost);
router.get("/posts/:id/comments", apiRateLimit, listPostComments);
router.post("/posts/:id/comments", apiRateLimit, createPostComment);

export default router;