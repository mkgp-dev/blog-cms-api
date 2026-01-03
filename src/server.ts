import { app } from "./app";
import { env } from "./config/env";
import prisma from "./config/prisma";
import { logger } from "./utils/logger.util";

const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "server listening");
});

const shutdown = (signal: string) => {
    logger.info({ signal }, "shutting down");
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));