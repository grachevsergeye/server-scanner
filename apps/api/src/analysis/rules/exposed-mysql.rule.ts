import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

import type {
    SecurityRule
} from './security-rule.interface.js'

export class ExposedMysqlRule
    implements SecurityRule {

    id = "exposed-mysql";

    name = "Exposed MySQL";

    evaluate(
        context: AnalysisContext
    ): SecurityFinding[] {

        const findings: SecurityFinding[] = [];

        for (const inspection of context.inspections) {

            if (inspection.type !== "mysql") {
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

                title: "MySQL exposed without authentication",

                description:
                    "A MySQL service is publicly accessible " +
                    "without authentication.",

                evidence: [
                    `Port ${inspection.port} is running MySQL.`,
                    "MySQL authentication was not detected.",
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