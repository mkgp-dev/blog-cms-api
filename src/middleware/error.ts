import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import z, { ZodError } from "zod";
import { logger } from "../utils/logger";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.status).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
                requestId: req.id,
            },
        });
    }
    
    if (err instanceof ZodError) {
        const details = z.flattenError(err);

        return res.status(400).json({
            error: {
                code: "invalid_request",
                message: "Invalid request data",
                details,
                requestId: req.id,
            },
        });
    }
    
    logger.error({ err, requestId: req.id }, "Unhandled error");
    res.status(500).json({
        error: {
            code: "internal_error",
            message: "Internal server error",
            requestId: req.id,
        },
    });
}