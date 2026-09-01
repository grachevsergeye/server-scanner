import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

import type {
    SecurityRule
} from './security-rule.interface.js'

export class ExposedTelnetRule implements SecurityRule {
    id = "exposed-telnet";

    name = "Exposed Telnet";

    evaluate(
        context: AnalysisContext
    ): SecurityFinding[] {
        const findings: SecurityFinding[] = [];

        for (const port of context.ports) {
            if (port.service !== "telnet") {
                continue;
            }

            findings.push({
                id: this.id,
                severity: "high",

                titleKey: "findings.exposedTelnet.title",

                descriptionKey:
                    "findings.exposedTelnet.description",

                evidence: [
                    {
                        key: "findings.exposedTelnet.evidence.portRunningService",
                        params: {
                            port: port.port,
                            service: "Telnet",
                        },
                    },
                ],

                port: port.port,
                service: "telnet",
                confidence: 1,
            });
        }

        return findings;
    }
}