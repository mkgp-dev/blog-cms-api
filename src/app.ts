import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { requestId } from "./middlewares/id.middleware";
import { pinoHttp } from "pino-http";
import { logger } from "./utils/logger.util";
import helmet from "helmet";
import { router } from "./routes";
import { notFound } from "./middlewares/unknown.middleware";
import { errorHandler } from "./middlewares/error.middleware";

export const app = express();

if (env.TRUST_PROXY) app.set("trust proxy", 1);

const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, "").toLowerCase();
const allowedOrigins = env.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map(normalizeOrigin);

const isAllowedOrigin = (origin?: string | null) => {
    if (!origin) return true;
    return allowedOrigins.includes(normalizeOrigin(origin));
};

app.disable("x-powered-by");
app.use(requestId());
app.use(pinoHttp({
    logger,
    customProps: (req) => ({ requestId: req.id }),
}));
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        callback(null, isAllowedOrigin(origin));
    },
    credentials: false,
    exposedHeaders: ["X-Request-Id"],
}));
app.use(express.json({ limit: "1mb" }));

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);