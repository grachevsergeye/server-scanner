import type { FastifyInstance } from "fastify";
import { ScannerService } from "../services/scan.service.js";

export async function scanRoutes(fastify: FastifyInstance) {

const ScannerService = new ScannerService();

    fastify.post("/scan", async (req, reply) => {

        const body = req.body as {
            ip: string;
        };

        const result = await ScannerService.scan(body);

        return result;

    });

}