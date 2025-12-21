import z from "zod";
import { asyncHandler } from "../utils/async";
import { Request, Response } from "express";
import { getPublicPostById, listPublicPost } from "../services/post";
import { AppError } from "../utils/errors";
import { createComment, listPublicComment } from "../services/comment";
import { CENSOR_TYPE, commentFilter, usernameFilter } from "../utils/profanity";

const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(10),
});

const idSchema = z.uuid();

const commentSchema = z.object({
    username: z.string().trim().min(2).max(50).refine((name) => !usernameFilter.exists(name), { message: "Username contains profanity" }),
    content: z.string().trim().min(1).max(1000).transform((text) => commentFilter.censor(text, CENSOR_TYPE)),
});

export const listAllPost = asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const { items, total } = await listPublicPost({ page, pageSize });

    res.status(200).json({
        data: items,
        meta: { page, pageSize, total },
    });
});

export const getPost = asyncHandler(async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const post = await getPublicPostById(id);

    if (!post) throw new AppError(404, "not_found", "Post not found");

    res.status(200).json({ data: post });
});

export const listPostComments = asyncHandler(async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const { page, pageSize } = paginationSchema.parse(req.query);

    const result = await listPublicComment(id, { page, pageSize });
    if (!result) throw new AppError(404, "not_found", "Post not found");

    res.status(200).json({
        data: result.items,
        meta: { page, pageSize, total: result.total },
    });
});

export const createPostComment = asyncHandler(async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const input = commentSchema.parse(req.body);

    const comment = await createComment(id, input);
    if (!comment) throw new AppError(404, "not_found", "Post not found");

    res.status(201).json({ data: comment });
});