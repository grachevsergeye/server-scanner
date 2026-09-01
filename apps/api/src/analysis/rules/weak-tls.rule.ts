import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

import type {
    SecurityRule
} from './security-rule.interface.js'

export class WeakTlsRule
    implements SecurityRule {

    id = "weak-tls";

    name = "Weak TLS Configuration";

    evaluate(
        context: AnalysisContext
    ): SecurityFinding[] {

        const findings: SecurityFinding[] = [];

        for (const inspection of context.inspections) {

            if (inspection.type !== "tls") {
                continue;
            }

            const protocol =
                inspection.data.protocol;

            const weakProtocols = [
                "TLSv1",
                "TLSv1.0",
                "TLSv1.1",
                "SSLv2",
                "SSLv3",
            ];

            if (
                weakProtocols.includes(protocol)
            ) {
                findings.push({
                    id: this.id,

                    severity: "high",

                    titleKey:
                        "findings.weakTls.title",

                    descriptionKey:
                        "findings.weakTls.description",

                    evidence: [
                        {
                            key:
                                "findings.weakTls.evidence.protocol",
                            params: {
                                protocol,
                            },
                        },
                    ],

                    port: inspection.port,

                    service: inspection.service,

                    confidence: 1,
                });
            }
        }

        return findings;
    }
}