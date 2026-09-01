import type {
    FastifyReply,
    FastifyRequest,
} from "fastify";

import { ScannerService } from "../services/scan.service.js";

import {
    scanJobRepository,
    scanTargetRepository,
} from "../scanner/scanner.dependencies.js";

const scanService =
    new ScannerService(
        scanJobRepository,
        scanTargetRepository
    );

interface ScanBody {
    targets: string[];
}

interface ScanParams {
    jobId: string;
}

export async function scanController(
    request: FastifyRequest<{
        Body: ScanBody;
    }>,
    reply: FastifyReply
) {
    const result =
        await scanService.createJob(
            request.body
        );

    return reply
        .code(202)
        .send(result);
}

export async function getScanController(
    request: FastifyRequest<{
        Params: ScanParams;
    }>,
    reply: FastifyReply
) {
    const result =
        await scanService.getJob(
            request.params.jobId
        );

    if (!result) {
        return reply
            .code(404)
            .send({
                message: "Scan job not found",
            });
    }

    return reply.send(result);
}

export async function getScansController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const scans = await scanService.getRecentScans(50);

    return reply.send(scans);
}