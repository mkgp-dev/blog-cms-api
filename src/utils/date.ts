import { AppError } from "./errors";

export function parseDate(value: string | undefined, field: string) {
    if (!value) return undefined;

    const date = new Date(value);
    if (Number.isNaN(date.valueOf())) throw new AppError(400, "invalid_query", `${field} must be a valid ISO date`);

    return date;
}