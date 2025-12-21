import prisma from "../config/prisma";

type Pagination = {
    page: number;
    pageSize: number;
}

const postSelect = {
    id: true,
};

const publicSelect = {
    id: true,
    username: true,
    content: true,
    createdAt: true,
    updatedAt: true,
};

const adminSelect = {
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
    },
};

export async function listPublicComment(postId: string, { page, pageSize }: Pagination) {
    const post = await prisma.post.findFirst({
        where: { id: postId, published: true },
        select: postSelect,
    });

    if (!post) return null;

    const skip = (page - 1) * pageSize;

    const [items, total] = await prisma.$transaction([
        prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            select: publicSelect,
        }),
        prisma.comment.count({ where: { postId } })
    ]);

    return { items, total };
}

export async function listAdminComment({ page, pageSize, authorId }: Pagination & { authorId: string }) {
    const skip = (page - 1) * pageSize;

    const [items, total] = await prisma.$transaction([
        prisma.comment.findMany({
            where: { post: { authorId } },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            select: adminSelect,
        }),
        prisma.comment.count({ where: { post: { authorId } } })
    ]);

    return { items, total };
}

export async function createComment(postId: string, input: { username: string, content: string }) {
    const post = await prisma.post.findFirst({
        where: { id: postId, published: true },
        select: postSelect,
    });

    if (!post) return null;

    return prisma.comment.create({
        data: {
            postId,
            username: input.username,
            content: input.content,
        },
        select: publicSelect
    });
}

export async function deleteComment(id: string, authorId: string) {
    const post = await prisma.comment.findFirst({
        where: { id, post: { authorId }},
        select: postSelect,
    });

    if (!post) return null;

    return prisma.comment.delete({
        where: { id },
        select: adminSelect,
    });
}