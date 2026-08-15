import type { FastifyInstance } from "fastify";
import { scanController } from "../controllers/scan.controller.js";

export async function scanRoutes(
    fastify: FastifyInstance
) {

    fastify.post(
        "/scan",
        scanController
    );

}