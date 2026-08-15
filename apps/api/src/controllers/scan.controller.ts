import type {
    FastifyReply,
    FastifyRequest
} from "fastify";

import { ScannerService } from "../services/scan.service.js";

import {
    scanJobRepository,
    scanTargetRepository
} from "../scanner/scanner.dependencies.js";

const scanService =
    new ScannerService(
        scanJobRepository,
        scanTargetRepository
    );

interface ScanBody {
    targets: string[];
}

export async function scanController(
    request: FastifyRequest<{
        Body: ScanBody
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