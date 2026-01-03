import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async.util";
import { AppError } from "../utils/errors.util";
import { verifyToken } from "../utils/jwt.util";
import z from "zod";
import { findByID } from "../services/user.service";

export const requireAuth = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) throw new AppError(401, "unauthorized", "Missing or invalid authorization header");

    const token = header.slice("Bearer ".length).trim();

    const payload = (() => {
        try {
            return verifyToken(token);
        } catch {
            throw new AppError(401, "unauthorized", "Invalid or expired token");
        }
    })();

    const parsedId = z.uuid().safeParse(payload.sub);
    if (!parsedId.success) throw new AppError(401, "unauthorized", "Invalid or expired token");

    const userId = parsedId.data;

    const user = await findByID(userId);
    if (!user) throw new AppError(401, "unauthorized", "Invalid or expired token");

    if (user.role !== "AUTHOR") throw new AppError(403, "forbidden", "Access denied");

    req.user = { id: user.id, role: user.role };
    next();
});