import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

export function requestId() {
    return (req: Request, res: Response, next: NextFunction) => {
        req.id = randomUUID();
        res.setHeader("X-Request-Id", req.id);
        next();
    };
}