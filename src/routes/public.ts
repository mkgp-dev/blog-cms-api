import { Router } from "express";
import { apiRateLimit } from "../middleware/limit";
import { createPostComment, getPost, listAllPost, listPostComments } from "../controllers/public";

const publicRouter = Router();

publicRouter.get("/posts", apiRateLimit, listAllPost);
publicRouter.get("/posts/:id", apiRateLimit, getPost);
publicRouter.get("/posts/:id/comments", apiRateLimit, listPostComments);
publicRouter.post("/posts/:id/comments", apiRateLimit, createPostComment);

export default publicRouter;