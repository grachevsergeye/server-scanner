import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3001),

    HOST: z.string().default("127.0.0.1"),

    NODE_ENV: z.enum([
        "development",
        "production",
        "test",
    ]).default("development"),

    API_VERSION: z.string().default("0.0.1"),

    NMAP_PATH: z.string().min(1),

    REDIS_HOST: z.string().default("127.0.0.1"),
    REDIS_PORT: z.coerce.number().default(6379),

    POSTGRES_HOST: z.string().default("127.0.0.1"),
    POSTGRES_PORT: z.coerce.number().default(5432),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),

    SCANNER_NMAP_TIMEOUT_MS:
        z.coerce.number().int().positive().default(20_000),

    SCANNER_INSPECTOR_TIMEOUT_MS:
        z.coerce.number().int().positive().default(5_000),

    SCANNER_TARGET_TIMEOUT_MS:
        z.coerce.number().int().positive().default(45_000),

    SCANNER_HTTP_TIMEOUT_MS:
        z.coerce.number().int().positive().default(5_000),

    SCANNER_TLS_TIMEOUT_MS:
        z.coerce.number().int().positive().default(3_000),

    SCANNER_SSH_TIMEOUT_MS:
        z.coerce.number().int().positive().default(5_000),

    SCANNER_TELNET_TIMEOUT_MS:
        z.coerce.number().int().positive().default(5_000),
});

export const env = envSchema.parse(process.env);