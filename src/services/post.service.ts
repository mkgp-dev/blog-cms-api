import prisma from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

type Pagination = {
    page: number;
    pageSize: number;
}

const publicSelect = {
    id: true,
    title: true,
    content: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
};

const adminSelect = {
    id: true,
    title: true,
    content: true,
    published: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
    authorId: true,
};

const updateSelect = {
    id: true,
    published: true,
};

const deleteSelect = {
    id: true,
};

export const listPublicPost = async ({ page, pageSize }: Pagination) => {
    const skip = (page - 1) * pageSize;

    const [items, total] = await prisma.$transaction([
        prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            select: publicSelect,
        }),
        prisma.post.count({ where: { published: true } }),
    ]);

    return { items, total };
};

export const getPublicPostById = async (id: string) => {
    return prisma.post.findFirst({
        where: { id, published: true },
        select: publicSelect,
    });
};

export const listAdminPost = async ({ page, pageSize, authorId }: Pagination & { authorId: string }) => {
    const skip = (page - 1) * pageSize;

    const [items, total] = await prisma.$transaction([
        prisma.post.findMany({
            where: { authorId },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            select: adminSelect,
        }),
        prisma.post.count({ where: { authorId } }),
    ]);

    return { items, total };
};

export const getAdminPostById = async (id: string, authorId: string) => {
    return prisma.post.findFirst({
        where: { id, authorId },
        select: adminSelect,
    });
};

export const createPost = async (input: { title: string; content: string; published: boolean; authorId: string }) => {
    const publishedAt = input.published ? new Date() : null;

    return prisma.post.create({
        data: {
            title: input.title,
            content: input.content,
            published: input.published,
            publishedAt,
            authorId: input.authorId,
        },
        select: adminSelect,
    });
};

export const updatePost = async (id: string, authorId: string, input: { title?: string; content?: string; published?: boolean }) => {
    const dataExist = await prisma.post.findFirst({
        where: { id, authorId },
        select: updateSelect,
    });

    if (!dataExist) return null;

    const data: Prisma.PostUpdateInput = {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.content !== undefined ? { content: input.content } : {}),
        ...(input.published !== undefined
            ? {
                published: input.published,
                publishedAt: input.published
                    ? dataExist.published
                        ? undefined
                        : new Date()
                    : null,
            }
            : {}),
    };

    return prisma.post.update({
        where: { id },
        data,
        select: adminSelect,
    });
};

export const deletePost = async (id: string, authorId: string) => {
    const dataExist = await prisma.post.findFirst({
        where: { id, authorId },
        select: deleteSelect,
    });

    if (!dataExist) return null;

    return prisma.post.delete({
        where: { id },
        select: adminSelect,
    });
};