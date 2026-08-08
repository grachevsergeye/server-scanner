import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env.js";

export async function healthController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    return reply.send({
        status: "ok",
        service: "server-scanner-api",
        version: env.API_VERSION,
    });
}