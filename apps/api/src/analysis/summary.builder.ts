import type {
    PortAnalysis,
    ScanSummary
} from "./types.js";

export class SummaryBuilder {

    build(
        ports: PortAnalysis[]
    ): ScanSummary {

        const services =
            new Set<string>();

        const technologies =
            new Set<string>();

        let webServices = 0;
        const databaseServices = ports.filter(port =>
            [
                "mysql",
                "postgresql",
                "mongodb",
                "redis",
                "memcached"
            ].includes(port.port.service)
        ).length;

        const risk = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            info: 0
        };

        for (const analysis of ports) {

            const service =
                analysis.fingerprint.service;

            if (service) {
                services.add(service);
            }

            for (
                const technology
                of analysis.fingerprint.technologies
            ) {
                technologies.add(technology);
            }

            switch (analysis.risk.level) {

                case "Critical":
                    risk.critical++;
                    break;

                case "High":
                    risk.high++;
                    break;

                case "Medium":
                    risk.medium++;
                    break;

                case "Low":
                    risk.low++;
                    break;

                case "Info":
                    risk.info++;
                    break;
            }

            if (
                service === "http" ||
                service === "https"
            ) {
                webServices++;
            }
        }

        return {

            totalPorts:
                ports.length,

            openPorts:
                ports.filter(
                    port =>
                        port.port.state === "open"
                ).length,

            services:
                [...services].sort(),

            technologies:
                [...technologies].sort(),

            risk,

            webServices,

            databaseServices
        };
    }
}