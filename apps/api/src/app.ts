import Fastify from "fastify";
import { healthRoutes } from "./routes/health.route.js";
import { versionRoutes } from "./routes/version.route.js";
import { scanRoutes } from "./routes/scan.route.js";

export function buildApp() {
    const app = Fastify({
        logger: true,
    });

    app.register(healthRoutes);
    app.register(versionRoutes);
    app.register(scanRoutes);

    return app;
}