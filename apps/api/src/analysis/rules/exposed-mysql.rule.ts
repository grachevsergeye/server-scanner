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

                titleKey:
                    "findings.exposedMysql.title",

                descriptionKey:
                    "findings.exposedMysql.description",

                evidence: [
                    {
                        key:
                            "findings.exposedMysql.evidence.portRunningService",
                        params: {
                            port: inspection.port,
                            service: "MySQL",
                        },
                    },
                    {
                        key:
                            "findings.exposedMysql.evidence.authenticationNotDetected",
                    },

                    ...(inspection.data.product
                        ? [
                            {
                                key:
                                    "findings.common.detectedProduct",
                                params: {
                                    product:
                                        inspection.data.product,
                                },
                            },
                        ]
                        : []),

                    ...(inspection.data.version
                        ? [
                            {
                                key:
                                    "findings.common.detectedVersion",
                                params: {
                                    version:
                                        inspection.data.version,
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