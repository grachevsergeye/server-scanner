import type {
    FastifyReply,
    FastifyRequest,
} from "fastify";

import { findingsService } from "../services/findings.service.js";

interface FindingsParams {
    jobId: string;
}

export async function getFindingsController(
    request: FastifyRequest<{
        Params: FindingsParams;
    }>,
    reply: FastifyReply
) {
    const findings =
        await findingsService.getByJobId(
            request.params.jobId
        );

    return reply.send({
        jobId: request.params.jobId,
        findings,
    });
}