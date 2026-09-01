import type { FastifyInstance } from "fastify";
import { versionController } from "../controllers/version.controller.js";

export async function versionRoutes(app: FastifyInstance) {
    app.get("/version", versionController);
}