import "dotenv/config";
import { env } from "../src/config/env";
import prisma from "../src/config/prisma";
import { hashPassword } from "../src/utils/password";

async function main() {
    const email = env.ADMIN_EMAIL;
    const password = env.ADMIN_PASSWORD;
    const name = env.ADMIN_NAME;

    if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the author account.");

    const dataExist = await prisma.user.findUnique({ where: { email } });
    if (dataExist) return;

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
        data: {
            email,
            passwordHash,
            role: "AUTHOR",
            name,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });