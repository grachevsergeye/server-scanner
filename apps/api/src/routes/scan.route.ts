import type { FastifyInstance } from "fastify";
import { ScanService } from "../services/scan.service.js";

export async function scanRoutes(fastify: FastifyInstance) {

const scanService = new ScanService();

    fastify.post("/scan", async (req, reply) => {

        const body = req.body as {
            ip: string;
        };

        const result = await scanService.scan(body);

        return result;

    });

}