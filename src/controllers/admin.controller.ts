import z from "zod";
import { asyncHandler } from "../utils/async.util";
import { Request, Response } from "express";
import { createPost, deletePost, getAdminPostById, listAdminPost, updatePost } from "../services/post.service";
import { AppError } from "../utils/errors.util";
import { deleteComment, listAdminComment } from "../services/comment.service";
import { parseDate } from "../utils/date.util";
import { searchComment, searchPost } from "../services/search.service";

const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(10),
});

const idSchema = z.uuid();

const createSchema = z.object({
    title: z.string().trim().min(1).max(200),
    content: z.string().trim().min(1),
    published: z.boolean().optional(),
});

const updateSchema = z.object({
    title: z.string().trim().min(1).max(200).optional(),
    content: z.string().trim().min(1).optional(),
    published: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided" });

const postQuerySchema = z.object({
    q: z.string().trim().max(200).optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    sort: z.enum(["createdAt:desc", "createdAt:asc", "title:asc", "title:desc"]).default("createdAt:desc"),
    published: z.enum(["true", "false"]).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
});

const commentQuerySchema = z.object({
    q: z.string().trim().max(200).optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    sort: z.enum(["createdAt:desc", "createdAt:asc"]).default("createdAt:desc"),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional()
});

export const listAllAdminPost = asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const authorId = req.user!.id;

    const { items, total } = await listAdminPost({ page, pageSize, authorId });

    res.status(200).json({
        data: items,
        meta: { page, pageSize, total }
    });
});

export const getAdminPost = asyncHandler(async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const authorId = req.user!.id;

    const post = await getAdminPostById(id, authorId);
    if (!post) throw new AppError(404, "not_found", "Post not found");

    res.status(200).json({ data: post });
});

export const createAdminPost = asyncHandler(async (req: Request, res: Response) => {
    const input = createSchema.parse(req.body);
    const authorId = req.user!.id;

    const post = await createPost({
        authorId,
        title: input.title,
        content: input.content,
        published: input.published ?? false,
    });

    res.status(201).json({ data: post });
});

export const updateAdminPost = asyncHandler(async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const input = updateSchema.parse(req.body);
    const authorId = req.user!.id;

    const updateSelectedPost = await updatePost(id, authorId, input);
    if (!updateSelectedPost) throw new AppError(404, "not_found", "Post not found");

    res.status(200).json({ data: updateSelectedPost });
});

export const deleteAdminPost = asyncHandler(async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const authorId = req.user!.id;

    const deleteSelectedPost = await deletePost(id, authorId);
    if (!deleteSelectedPost) throw new AppError(404, "not_found", "Post not found");

    res.status(204).send();
});

export const listAllComment = asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const authorId = req.user!.id;

    const { items, total } = await listAdminComment({ page, pageSize, authorId });

    res.status(200).json({
        data: items,
        meta: { page, pageSize, total },
    });
});

export const deleteAdminComment = asyncHandler(async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const authorId = req.user!.id;

    const deleteSelectedComment = await deleteComment(id, authorId);
    if (!deleteSelectedComment) throw new AppError(404, "not_found", "Comment not found");

    res.status(204).send();
});

export const searchAdminPost = asyncHandler(async (req: Request, res: Response) => {
    const query = postQuerySchema.parse(req.query);
    const q = query.q?.trim() || undefined;
    const dateFrom = parseDate(query.dateFrom, "dateFrom");
    const dateTo = parseDate(query.dateTo, "dateTo");

    if (dateFrom && dateTo && dateFrom > dateTo) throw new AppError(400, "invalid_query", "dateFrom must be before dateTo");

    const published = query.published === undefined ? undefined : query.published === "true";

    const { items, total } = await searchPost({
        authorId: req.user!.id,
        q,
        published,
        dateFrom,
        dateTo,
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
    });

    res.status(200).json({
        data: items,
        meta: {
            page: query.page,
            pageSize: query.pageSize,
            total,
        },
    });
});

export const searchAdminComment = asyncHandler(async (req: Request, res: Response) => {
    const query = commentQuerySchema.parse(req.query);
    const q = query.q?.trim() || undefined;
    const dateFrom = parseDate(query.dateFrom, "dateFrom");
    const dateTo = parseDate(query.dateTo, "dateTo");

    if (dateFrom && dateTo && dateFrom > dateTo) throw new AppError(400, "invalid_query", "dateFrom must be before dateTo");

    const { items, total } = await searchComment({
        authorId: req.user!.id,
        q,
        dateFrom,
        dateTo,
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
    });

    res.status(200).json({
        data: items,
        meta: {
            page: query.page,
            pageSize: query.pageSize,
            total,
        },
    });
});