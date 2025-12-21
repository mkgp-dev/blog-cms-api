import { Request, Response } from "express";

export function notFound(req: Request, res: Response) {
    return res.status(404).json({
        error: {
            code: "not_found",
            message: "Route not found",
            requestId: req.id,
        },
    });
}