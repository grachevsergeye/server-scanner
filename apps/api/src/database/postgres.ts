import pg from "pg";

const { Pool } = pg;

console.log("[PostgreSQL config]", {
    host: JSON.stringify(process.env.POSTGRES_HOST),
    port: JSON.stringify(process.env.POSTGRES_PORT),
    user: JSON.stringify(process.env.POSTGRES_USER),
    password: JSON.stringify(process.env.POSTGRES_PASSWORD),
    passwordLength: process.env.POSTGRES_PASSWORD?.length,
    database: JSON.stringify(process.env.POSTGRES_DB),
});

export const postgres = new Pool({
    host: process.env.POSTGRES_HOST ?? "127.0.0.1",
    port: Number(process.env.POSTGRES_PORT ?? 5432),

    user: process.env.POSTGRES_USER ?? "scanner",
    password: process.env.POSTGRES_PASSWORD ?? "scanner",
    database: process.env.POSTGRES_DB ?? "server_scanner",

    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
});

export async function testPostgresConnection(): Promise<void> {
    try {
        const result = await postgres.query(
            "SELECT NOW() AS now"
        );

        console.log(
            "[PostgreSQL] connected:",
            result.rows[0]
        );
    } catch (error) {
        console.error(
            "[PostgreSQL] connection failed:",
            error
        );

        throw error;
    }
}