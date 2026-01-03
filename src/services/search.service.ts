import prisma from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

type PostSortKey = "createdAt:desc" | "createdAt:asc" | "title:asc" | "title:desc";
type CommentSortKey = "createdAt:desc" | "createdAt:asc";

const postSortMap: Record<PostSortKey, Prisma.PostOrderByWithRelationInput> = {
    "createdAt:desc": { createdAt: "desc" },
    "createdAt:asc": { createdAt: "asc" },
    "title:asc": { title: "asc" },
    "title:desc": { title: "desc" },
};

const commentSortMap: Record<CommentSortKey, Prisma.CommentOrderByWithRelationInput> = {
    "createdAt:desc": { createdAt: "desc" },
    "createdAt:asc": { createdAt: "asc" },
};

type PostSearchInput = {
    authorId: string;
    q?: string;
    published?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
    page: number;
    pageSize: number;
    sort: PostSortKey;
};

type CommentSearchInput = {
    authorId: string;
    q?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page: number;
    pageSize: number;
    sort: CommentSortKey;
};

const postSelect = {
    id: true,
    title: true,
    content: true,
    published: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
    authorId: true,
};

const commentSelect = {
    id: true,
    username: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    post: {
        select: {
            id: true,
            title: true
        }
    }
};

export const searchPost = async (input: PostSearchInput) => {
    const skip = (input.page - 1) * input.pageSize;

    const where: Prisma.PostWhereInput = {
        authorId: input.authorId,
        ...(input.q ? { title: { contains: input.q, mode: "insensitive" } } : {}),
        ...(input.published !== undefined ? { published: input.published } : {}),
        ...(input.dateFrom || input.dateTo
            ? {
                createdAt: {
                    ...(input.dateFrom ? { gte: input.dateFrom } : {}),
                    ...(input.dateTo ? { lte: input.dateTo } : {}),
                },
            }
            : {}),
    };

    const [items, total] = await prisma.$transaction([
        prisma.post.findMany({
            where,
            orderBy: postSortMap[input.sort],
            skip,
            take: input.pageSize,
            select: postSelect,
        }),
        prisma.post.count({ where }),
    ]);

    return { items, total };
};

export const searchComment = async (input: CommentSearchInput) => {
    const skip = (input.page - 1) * input.pageSize;

    const where: Prisma.CommentWhereInput = {
        post: { authorId: input.authorId },
        ...(input.q
            ? {
                OR: [
                    { username: { contains: input.q, mode: "insensitive" } },
                    { content: { contains: input.q, mode: "insensitive" } },
                ],
            }
            : {}),
        ...(input.dateFrom || input.dateTo
            ? {
                createdAt: {
                    ...(input.dateFrom ? { gte: input.dateFrom } : {}),
                    ...(input.dateTo ? { lte: input.dateTo } : {}),
                },
            }
            : {}),
    };

    const [items, total] = await prisma.$transaction([
        prisma.comment.findMany({
            where,
            orderBy: commentSortMap[input.sort],
            skip,
            take: input.pageSize,
            select: commentSelect,
        }),
        prisma.comment.count({ where }),
    ]);

    return { items, total };
};