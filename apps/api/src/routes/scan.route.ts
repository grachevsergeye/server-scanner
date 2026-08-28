import type { FastifyInstance } from "fastify";

import {
    scanController,
    getScanController,
    getScansController,
} from "../controllers/scan.controller.js";

import { getFindingsController } from "../controllers/findings.controller.js";

export async function scanRoutes(
    fastify: FastifyInstance
) {
    fastify.post(
        "/scan",
        scanController
    );

    // Scan history
    fastify.get(
        "/scan",
        getScansController
    );

    // Single scan
    fastify.get(
        "/scan/:jobId",
        getScanController
    );

    // Findings
    fastify.get(
        "/findings/:jobId",
        getFindingsController
    );
}