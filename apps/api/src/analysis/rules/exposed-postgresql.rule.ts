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

                titleKey:
                    "findings.exposedPostgresql.title",

                descriptionKey:
                    "findings.exposedPostgresql.description",

                evidence: [
                    {
                        key:
                            "findings.exposedPostgresql.evidence.portRunningService",
                        params: {
                            port: inspection.port,
                            service: "PostgreSQL",
                        },
                    },
                    {
                        key:
                            "findings.exposedPostgresql.evidence.authenticationNotDetected",
                    },

                    ...(inspection.data.product
                        ? [
                            {
                                key: "findings.common.detectedProduct",
                                params: {
                                    product: inspection.data.product,
                                },
                            },
                        ]
                        : []),

                    ...(inspection.data.version
                        ? [
                            {
                                key: "findings.common.detectedVersion",
                                params: {
                                    version: inspection.data.version,
                                },
                            },
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