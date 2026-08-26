import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

import {
    securityRules
} from "../rules/rule.registry.js";

export class SecurityRuleEngine {

    evaluate(
        context: AnalysisContext
    ): SecurityFinding[] {

        console.log(
            "[SECURITY CONTEXT]",
            context.ports.map(port => ({
                port: port.port,
                state: port.state,
                service: port.service,
                product: port.product,
                version: port.version,
            }))
        );

        const findings: SecurityFinding[] = [];

        for (const rule of securityRules) {

            try {

                const result =
                    rule.evaluate(context);

                findings.push(...result);

            } catch (error) {

                console.error(
                    `[SecurityRuleEngine] Rule failed: ${rule.id}`,
                    error
                );

            }

        }

        console.log(
            "[SECURITY FINDINGS]",
            findings.map(finding => ({
                id: finding.id,
                severity: finding.severity,
                title: finding.title,
                port: finding.port,
                service: finding.service,
                confidence: finding.confidence
            }))
        );

        return findings;

    }
}