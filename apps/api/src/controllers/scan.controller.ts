import type { FastifyReply, FastifyRequest } from "fastify";
import { ScanService } from "../services/scan.service.js";

const scanService = new ScanService();

interface ScanBody {
    ip: string;
}

export async function scanController(
    request: FastifyRequest<{ Body: ScanBody }>,
    reply: FastifyReply
) {
    const result = await scanService.scan(request.body);

    return reply.code(202).send(result);
}