import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
    PORT: z.coerce.number().default(3001),

    HOST: z.string().default("0.0.0.0"),

    NODE_ENV: z.enum([
        "development",
        "production",
        "test",
    ]),

    API_VERSION: z.string(),

    NMAP_PATH: z.string(),
});

export const env = envSchema.parse(process.env);