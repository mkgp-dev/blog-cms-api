import z from "zod";
import { asyncHandler } from "../utils/async";
import { Request, Response } from "express";
import { findByEmail } from "../services/user";
import { AppError } from "../utils/errors";
import { verifyPassword } from "../utils/password";
import { signToken } from "../utils/jwt";

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(128),
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await findByEmail(email);
    if (!user) throw new AppError(401, "invalid_credentials", "Invalid email or password");

    const verifyPasswordInput = await verifyPassword(password, user.passwordHash);
    if (!verifyPasswordInput) throw new AppError(401, "invalid_credentials", "Invalid email or password");

    if (user.role !== "AUTHOR") throw new AppError(403, "forbidden", "Access denied");

    const token = signToken({ id: user.id, role: user.role });

    res.status(200).json({ token });
});