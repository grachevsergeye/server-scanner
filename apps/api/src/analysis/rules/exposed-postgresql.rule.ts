import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

import type {
    SecurityRule
} from './security-rule.interface.js'

export class ExposedPostgresqlRule
    implements SecurityRule {

    id = "exposed-postgresql";

    name = "Exposed PostgreSQL";

    evaluate(
        context: AnalysisContext
    ): SecurityFinding[] {

        const findings: SecurityFinding[] = [];

        for (const inspection of context.inspections) {

            if (inspection.type !== "postgresql") {
                continue;
            }

            const authentication =
                inspection.data.authentication;

            if (
                authentication?.required !== false
            ) {
                continue;
            }

            findings.push({
                id: this.id,

                severity: "critical",

                title:
                    "PostgreSQL exposed without authentication",

                description:
                    "A PostgreSQL service is publicly accessible " +
                    "without authentication.",

                evidence: [
                    `Port ${inspection.port} is running PostgreSQL.`,
                    "PostgreSQL authentication was not detected.",
                    ...(inspection.data.product
                        ? [
                            `Product: ${inspection.data.product}`,
                        ]
                        : []),
                    ...(inspection.data.version
                        ? [
                            `Version: ${inspection.data.version}`,
                        ]
                        : []),
                ],

                port: inspection.port,

                service: inspection.service,

                confidence: 1,
            });
        }

        return findings;
    }
}