import prisma from "../config/prisma";

const emailSelect = {
    id: true,
    email: true,
    passwordHash: true,
    role: true,
};

const idSelect = {
    id: true,
    role: true,
};

export const findByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email },
        select: emailSelect,
    });
};

export const findByID = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
        select: idSelect,
    });
};