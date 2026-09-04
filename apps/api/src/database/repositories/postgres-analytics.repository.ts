import {
    analyticsDb,
    analyticsAdminDb,
} from "../analytics-db.js";

export type AnalyticsDataset =
    | "link_clicks"
    | "click_events";

export interface AnalyticsFilters {
    source?: string;
    trafficSource?: string;
    ip?: string;
    targetUrl?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
}

interface BuiltWhere {
    sql: string;
    values: unknown[];
}

function buildWhere(
    dataset: AnalyticsDataset,
    filters: AnalyticsFilters,
): BuiltWhere {
    const clauses: string[] = [];
    const values: unknown[] = [];

    function add(
        sql: string,
        value: unknown,
    ) {
        values.push(value);
        clauses.push(
            sql.replace(
                "?",
                `$${values.length}`,
            ),
        );
    }

    if (filters.source) {
        add(
            "source_name = ?",
            filters.source,
        );
    }

    if (filters.ip) {
        add(
            "ip_address = ?",
            filters.ip,
        );
    }

    if (
        dataset === "click_events" &&
        filters.trafficSource
    ) {
        add(
            "traffic_source = ?",
            filters.trafficSource,
        );
    }

    if (
        dataset === "click_events" &&
        filters.targetUrl
    ) {
        add(
            "target_url ILIKE ?",
            `%${filters.targetUrl}%`,
        );
    }

    if (filters.from) {
        add(
            "created_at >= ?",
            filters.from,
        );
    }

    if (filters.to) {
        add(
            "created_at <= ?",
            filters.to,
        );
    }

    return {
        sql:
            clauses.length > 0
                ? `WHERE ${clauses.join(" AND ")}`
                : "",
        values,
    };
}

function getTable(
    dataset: AnalyticsDataset,
) {
    return dataset === "click_events"
        ? "csrdp.click_events"
        : "csrdp.link_clicks";
}

export class PostgresAnalyticsRepository {
    delete: any;
    async getOverview() {
        const result =
            await analyticsDb.query(`
                SELECT
                    (
                        SELECT COUNT(*)
                        FROM csrdp.registrations
                    ) AS registrations,
                    (
                        SELECT COUNT(*)
                        FROM csrdp.link_clicks
                    ) AS link_clicks,
                    (
                        SELECT COUNT(*)
                        FROM csrdp.click_events
                    ) AS click_events
            `);

        return {
            registrations:
                Number(
                    result.rows[0]
                        .registrations,
                ),
            link_clicks:
                Number(
                    result.rows[0]
                        .link_clicks,
                ),
            click_events:
                Number(
                    result.rows[0]
                        .click_events,
                ),
        };
    }

    async find(
        dataset: AnalyticsDataset,
        filters: AnalyticsFilters,
    ) {
        const table =
            getTable(dataset);

        const where =
            buildWhere(
                dataset,
                filters,
            );

        const limit = Math.min(
            Math.max(
                filters.limit ?? 50,
                1,
            ),
            500,
        );

        const offset = Math.max(
            filters.offset ?? 0,
            0,
        );

        const limitIndex =
            where.values.length + 1;

        const offsetIndex =
            where.values.length + 2;

        const columns =
            dataset === "click_events"
                ? `
                    id,
                    source_name,
                    ip_address,
                    target_url,
                    traffic_source,
                    created_at
                `
                : `
                    id,
                    source_name,
                    ip_address,
                    created_at
                `;

        const result =
            await analyticsDb.query(
                `
                    SELECT
                        ${columns}
                    FROM ${table}
                    ${where.sql}
                    ORDER BY created_at DESC
                    LIMIT $${limitIndex}
                    OFFSET $${offsetIndex}
                `,
                [
                    ...where.values,
                    limit,
                    offset,
                ],
            );

        return result.rows;
    }

    async count(
        dataset: AnalyticsDataset,
        filters: AnalyticsFilters,
    ): Promise<number> {
        const table =
            getTable(dataset);

        const where =
            buildWhere(
                dataset,
                filters,
            );

        const result =
            await analyticsDb.query(
                `
                    SELECT COUNT(*)::int AS count
                    FROM ${table}
                    ${where.sql}
                `,
                where.values,
            );

        return Number(
            result.rows[0].count,
        );
    }

    async exportRows(
        dataset: AnalyticsDataset,
        filters: AnalyticsFilters,
    ) {
        const table =
            getTable(dataset);

        const where =
            buildWhere(
                dataset,
                filters,
            );

        const columns =
            dataset === "click_events"
                ? `
                    id,
                    source_name,
                    ip_address,
                    target_url,
                    traffic_source,
                    created_at
                `
                : `
                    id,
                    source_name,
                    ip_address,
                    created_at
                `;

        const result =
            await analyticsDb.query(
                `
                    SELECT
                        ${columns}
                    FROM ${table}
                    ${where.sql}
                    ORDER BY created_at DESC
                `,
                where.values,
            );

        return result.rows;
    }

    async deleteFiltered(
        dataset: AnalyticsDataset,
        filters: AnalyticsFilters,
    ): Promise<number> {
        const table =
            getTable(dataset);

        const where =
            buildWhere(
                dataset,
                filters,
            );

        if (!where.sql) {
            throw new Error(
                "Refusing unfiltered delete",
            );
        }

        const result =
            await analyticsAdminDb.query(
                `
                    DELETE FROM ${table}
                    ${where.sql}
                `,
                where.values,
            );

        return result.rowCount ?? 0;
    }

    async deleteLast(
        dataset: AnalyticsDataset,
        count: number,
    ): Promise<number> {
        const table =
            getTable(dataset);

        const safeCount =
            Math.min(
                Math.max(count, 1),
                10000,
            );

        const result =
            await analyticsAdminDb.query(
                `
                    DELETE FROM ${table}
                    WHERE id IN (
                        SELECT id
                        FROM ${table}
                        ORDER BY created_at DESC
                        LIMIT $1
                    )
                `,
                [safeCount],
            );

        return result.rowCount ?? 0;
    }

    async deleteRange(
        dataset: AnalyticsDataset,
        from: string,
        to: string,
    ): Promise<number> {
        const table =
            getTable(dataset);

        const result =
            await analyticsAdminDb.query(
                `
                    DELETE FROM ${table}
                    WHERE created_at >= $1
                    AND created_at <= $2
                `,
                [from, to],
            );

        return result.rowCount ?? 0;
    }
}