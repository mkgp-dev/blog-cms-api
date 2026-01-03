import { Router } from "express";
import { createAdminPost, deleteAdminComment, deleteAdminPost, getAdminPost, listAllAdminPost, listAllComment, searchAdminComment, searchAdminPost, updateAdminPost } from "../controllers/admin.controller";

const router = Router();

router.get("/posts", listAllAdminPost);
router.post("/posts", createAdminPost);
router.get("/posts/:id", getAdminPost);
router.put("/posts/:id", updateAdminPost);
router.delete("/posts/:id", deleteAdminPost);
router.get("/comments", listAllComment);
router.delete("/comments/:id", deleteAdminComment);
router.get("/search/posts", searchAdminPost);
router.get("/search/comments", searchAdminComment);

export default router;