import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

import type {
    SecurityRule
} from './security-rule.interface.js'

export class MissingSecurityHeadersRule
    implements SecurityRule {

    id = "missing-security-headers";

    name = "Missing Security Headers";

    evaluate(
        context: AnalysisContext
    ): SecurityFinding[] {

        const findings: SecurityFinding[] = [];

        for (const inspection of context.inspections) {

            if (inspection.type !== "http") {
                continue;
            }

            const headers =
                inspection.data.securityHeaders;

            const missing: string[] = [];

            if (!headers.hsts) {
                missing.push(
                    "Strict-Transport-Security"
                );
            }

            if (!headers.csp) {
                missing.push(
                    "Content-Security-Policy"
                );
            }

            if (!headers.xFrameOptions) {
                missing.push(
                    "X-Frame-Options"
                );
            }

            if (!headers.xContentTypeOptions) {
                missing.push(
                    "X-Content-Type-Options"
                );
            }

            if (!headers.referrerPolicy) {
                missing.push(
                    "Referrer-Policy"
                );
            }

            if (!headers.permissionsPolicy) {
                missing.push(
                    "Permissions-Policy"
                );
            }

            if (missing.length === 0) {
                continue;
            }

            findings.push({
                id: this.id,

                severity: "low",

                title: "Missing security headers",

                description:
                    "The HTTP service is missing one or more " +
                    "recommended security headers.",

                evidence: [
                    `Missing: ${missing.join(", ")}`,
                ],

                port: inspection.port,

                service: inspection.service,

                confidence: 1,
            });
        }

        return findings;
    }
}