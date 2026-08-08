import type { FastifyReply, FastifyRequest } from "fastify";

export async function versionController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    return reply.send({
        "name": "server-scanner",
        "version": "0.0.1"
    });
}