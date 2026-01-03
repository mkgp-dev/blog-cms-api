import { JwtPayload, Secret, sign, SignOptions, verify } from "jsonwebtoken";
import { env } from "../config/env";

type Role = "AUTHOR";

type Payload = JwtPayload & {
    sub: string;
    role: Role;
};

export const signToken = (user: { id: string; role: Role }) => {
    const secret = env.JWT_SECRET as Secret;
    const expiresIn = env.JWT_EXPIRES_IN as SignOptions["expiresIn"];

    return sign(
        { role: user.role },
        secret,
        {
            subject: user.id,
            expiresIn,
        }
    );
};

export const verifyToken = (token: string): Payload => {
    const payload = verify(token, env.JWT_SECRET);
    if (typeof payload === "string" || !("sub" in payload) || !payload.sub) {
        throw new Error("Invalid token");
    }

    return payload as Payload;
};