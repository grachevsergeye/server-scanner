import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const commonConfig = {
    host: process.env.ANALYTICS_DB_HOST,
    port: Number(
        process.env.ANALYTICS_DB_PORT ?? 5432
    ),
    database: process.env.ANALYTICS_DB_NAME,
    options: "-c search_path=csrdp",
};

export const analyticsDb = new Pool({
    ...commonConfig,
    user: process.env.ANALYTICS_DB_USER,
    password: process.env.ANALYTICS_DB_PASSWORD,
});

export const analyticsAdminDb = new Pool({
    ...commonConfig,
    user: process.env.ANALYTICS_ADMIN_DB_USER,
    password: process.env.ANALYTICS_ADMIN_DB_PASSWORD,
});