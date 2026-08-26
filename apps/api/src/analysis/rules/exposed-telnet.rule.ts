import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

import type {
    SecurityRule
} from './security-rule.interface.js'
export class ExposedTelnetRule
    implements SecurityRule {

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

                title: "Telnet service exposed",

                description:
                    "A Telnet service is publicly accessible. " +
                    "Telnet transmits authentication and session " +
                    "data without modern transport encryption.",

                evidence: [
                    `Port ${port.port} is running Telnet.`,
                ],

                port: port.port,

                service: "telnet",

                confidence: 1,
            });
        }

        return findings;
    }
}