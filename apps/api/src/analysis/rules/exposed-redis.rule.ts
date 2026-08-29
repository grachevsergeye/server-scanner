import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

import type {
    SecurityRule
} from './security-rule.interface.js'

export class ExposedRedisRule
    implements SecurityRule {

    id = "exposed-redis";

    name = "Exposed Redis";

    evaluate(
        context: AnalysisContext
    ): SecurityFinding[] {

        const findings: SecurityFinding[] = [];

        for (const port of context.ports) {

            if (port.service !== "redis") {
                continue;
            }

            const inspection =
                context.inspections.find(
                    (item) =>
                        item.type === "redis" &&
                        item.port === port.port
                );

            const authentication =
                inspection?.type === "redis"
                    ? inspection.data.authentication
                    : undefined;

            if (
                authentication?.required === true
            ) {
                continue;
            }

            findings.push({
                id: this.id,
                severity: "critical",

                titleKey:
                    "findings.exposedRedis.title",

                descriptionKey:
                    "findings.exposedRedis.description",

                evidence: [
                    {
                        key:
                            "findings.exposedRedis.evidence.portRunningService",
                        params: {
                            port: port.port,
                            service: "Redis",
                        },
                    },
                    {
                        key:
                            "findings.exposedRedis.evidence.authenticationNotDetected",
                    },
                ],

                port: port.port,
                service: "redis",
                confidence:
                    authentication?.required === false
                        ? 1
                        : 0.8,
            });
        }

        return findings;
    }
}