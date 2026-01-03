import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => bcrypt.hash(password, SALT_ROUNDS);
export const verifyPassword = async (password: string, hashPassword: string) => bcrypt.compare(password, hashPassword);