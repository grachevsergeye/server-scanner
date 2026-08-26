import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

import type {
    SecurityRule
} from './security-rule.interface.js'

export class ExposedMemcachedRule
    implements SecurityRule {

    id = "exposed-memcached";

    name = "Exposed Memcached";

    evaluate(
        context: AnalysisContext
    ): SecurityFinding[] {

        const findings: SecurityFinding[] = [];

        for (const port of context.ports) {

            if (port.service !== "memcached") {
                continue;
            }

            const inspection =
                context.inspections.find(
                    (item) =>
                        item.type === "memcached" &&
                        item.port === port.port
                );

            const authentication =
                inspection?.type === "memcached"
                    ? inspection.data.authentication
                    : undefined;

            findings.push({
                id: this.id,

                severity: "critical",

                title: "Memcached service exposed",

                description:
                    "A Memcached service is publicly accessible. " +
                    "Memcached should generally not be directly " +
                    "exposed to untrusted networks.",

                evidence: [
                    `Port ${port.port} is running Memcached.`,
                    ...(authentication
                        ? [
                            `Authentication required: ${
                                authentication.required
                                    ? "yes"
                                    : "no"
                            }.`,
                        ]
                        : []),
                ],

                port: port.port,

                service: "memcached",

                confidence: 1,
            });
        }

        return findings;
    }
}