import { Router } from "express";
import { createAdminPost, deleteAdminComment, deleteAdminPost, getAdminPost, listAllAdminPost, listAllComment, searchAdminComment, searchAdminPost, updateAdminPost } from "../controllers/admin";

const adminRouter = Router();

adminRouter.get("/posts", listAllAdminPost);
adminRouter.post("/posts", createAdminPost);
adminRouter.get("/posts/:id", getAdminPost);
adminRouter.put("/posts/:id", updateAdminPost);
adminRouter.delete("/posts/:id", deleteAdminPost);
adminRouter.get("/comments", listAllComment);
adminRouter.delete("/comments/:id", deleteAdminComment);
adminRouter.get("/search/posts", searchAdminPost);
adminRouter.get("/search/comments", searchAdminComment);

export default adminRouter;