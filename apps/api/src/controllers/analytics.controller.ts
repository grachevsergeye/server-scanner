import type {
    FastifyReply,
    FastifyRequest,
} from "fastify";

import {
    PostgresAnalyticsRepository,
    type AnalyticsDataset,
    type AnalyticsFilters,
} from "../database/repositories/postgres-analytics.repository.js";

import { toCsv } from "../utils/csv.js";

const repository =
    new PostgresAnalyticsRepository();

interface AnalyticsQuery {
    dataset?: AnalyticsDataset;
    source?: string;
    trafficSource?: string;
    ip?: string;
    targetUrl?: string;
    from?: string;
    to?: string;
    limit?: string;
    offset?: string;
}

function parseFilters(
    query: AnalyticsQuery,
): AnalyticsFilters {
    const filters: AnalyticsFilters = {
        limit: query.limit
            ? Number(query.limit)
            : 50,
        offset: query.offset
            ? Number(query.offset)
            : 0,
    };

    if (query.source) {
        filters.source = query.source;
    }

    if (query.trafficSource) {
        filters.trafficSource =
            query.trafficSource;
    }

    if (query.ip) {
        filters.ip = query.ip;
    }

    if (query.targetUrl) {
        filters.targetUrl =
            query.targetUrl;
    }

    if (query.from) {
        filters.from = query.from;
    }

    if (query.to) {
        filters.to = query.to;
    }

    return filters;
}

export async function getAnalyticsController(
    request: FastifyRequest<{
        Querystring: AnalyticsQuery;
    }>,
    reply: FastifyReply,
) {
    const dataset =
        request.query.dataset ??
        "click_events";

    const filters =
        parseFilters(
            request.query,
        );

    const [rows, total] =
        await Promise.all([
            repository.find(
                dataset,
                filters,
            ),

            repository.count(
                dataset,
                filters,
            ),
        ]);

    return reply.send({
        dataset,
        total,
        rows,
    });
}

export async function previewAnalyticsDeleteController(
    request: FastifyRequest<{
        Querystring: AnalyticsQuery;
    }>,
    reply: FastifyReply,
) {
    const dataset =
        request.query.dataset ??
        "click_events";

    const filters =
        parseFilters(
            request.query,
        );

    const count =
        await repository.count(
            dataset,
            filters,
        );

    return reply.send({
        dataset,
        count,
    });
}

interface DeleteBody {
    dataset: AnalyticsDataset;

    mode:
        | "filtered"
        | "last"
        | "range";

    filters?: AnalyticsFilters;

    count?: number;

    from?: string;

    to?: string;
}

export async function deleteAnalyticsController(
    request: FastifyRequest<{
        Body: DeleteBody;
    }>,
    reply: FastifyReply,
) {
    const {
        dataset,
        mode,
        filters,
        count,
    } = request.body;

    if (
        mode === "filtered" &&
        !filters
    ) {
        return reply
            .status(400)
            .send({
                message:
                    "Filters are required",
            });
    }

    if (
        mode === "range" &&
        (
            !filters?.from ||
            !filters?.to
        )
    ) {
        return reply
            .status(400)
            .send({
                message:
                    "From and to are required",
            });
    }

    if (
        mode === "last" &&
        (
            !count ||
            count < 1 ||
            count > 10000
        )
    ) {
        return reply
            .status(400)
            .send({
                message:
                    "Valid count required",
            });
    }

    const deleted =
        await repository.delete(
            dataset,
            mode,
            filters,
            count,
        );

    return reply.send({
        success: true,
        deleted,
    });
}

export async function exportAnalyticsController(
    request: FastifyRequest<{
        Querystring: AnalyticsQuery;
    }>,
    reply: FastifyReply,
) {
    const dataset =
        request.query.dataset ??
        "click_events";

    const filters =
        parseFilters(
            request.query,
        );

    const rows =
        await repository.exportRows(
            dataset,
            filters,
        );

    const csv =
        toCsv(rows);

    reply.header(
        "Content-Type",
        "text/csv; charset=utf-8",
    );

    reply.header(
        "Content-Disposition",
        `attachment; filename="${dataset}.csv"`,
    );

    return reply.send(csv);
}

export async function getAnalyticsOverviewController(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const overview =
        await repository.getOverview();

    return reply.send(overview);
}