import type { FastifyInstance } from "fastify";

import {
    getAnalyticsController,
    getAnalyticsOverviewController,
    previewAnalyticsDeleteController,
    deleteAnalyticsController,
    exportAnalyticsController,
} from "../controllers/analytics.controller.js";

export async function analyticsRoutes(
    fastify: FastifyInstance,
) {
    fastify.get(
        "/analytics/overview",
        getAnalyticsOverviewController,
    );

    fastify.get(
        "/analytics",
        getAnalyticsController,
    );

    fastify.get(
        "/analytics/delete-preview",
        previewAnalyticsDeleteController,
    );

    fastify.delete(
        "/analytics",
        deleteAnalyticsController,
    );

    fastify.get(
        "/analytics/export",
        exportAnalyticsController,
    );
}