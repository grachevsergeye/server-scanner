import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

import type {
    SecurityRule
} from './security-rule.interface.js'

interface SoftwareVersionRule {
    product: string;
    minimumVersion: string;
    severity:
        | "low"
        | "medium"
        | "high"
        | "critical";
    reasonKey: string;
}

function compareVersions(
    a: string,
    b: string
): number {

    const aParts = a
        .split(".")
        .map(Number);

    const bParts = b
        .split(".")
        .map(Number);

    const length =
        Math.max(
            aParts.length,
            bParts.length
        );

    for (let i = 0; i < length; i++) {

        const aValue =
            aParts[i] ?? 0;

        const bValue =
            bParts[i] ?? 0;

        if (aValue > bValue) {
            return 1;
        }

        if (aValue < bValue) {
            return -1;
        }
    }

    return 0;
}

export class OutdatedSoftwareRule
    implements SecurityRule {

    id = "outdated-software";

    name = "Outdated Software";

    evaluate(
        context: AnalysisContext
    ): SecurityFinding[] {

        const findings: SecurityFinding[] = [];

        for (const inspection of context.inspections) {

            let product: string | undefined;
            let version: string | undefined;

            if (
                inspection.type === "mysql" ||
                inspection.type === "postgresql" ||
                inspection.type === "mongodb" ||
                inspection.type === "memcached"
            ) {
                product =
                    inspection.data.product;

                version =
                    inspection.data.version;
            }

            if (!product || !version) {
                continue;
            }

            const rule =
                outdatedSoftware.find(
                    (item) =>
                        product
                            .toLowerCase()
                            .includes(
                                item.product.toLowerCase()
                            )
                );

            if (!rule) {
                continue;
            }

            if (
                compareVersions(
                    version,
                    rule.minimumVersion
                ) >= 0
            ) {
                continue;
            }

            findings.push({
                id: this.id,
                severity: rule.severity,

                titleKey:
                    "findings.outdatedSoftware.title",

                descriptionKey:
                    rule.reasonKey,

                evidence: [
                    {
                        key:
                            "findings.outdatedSoftware.evidence.detectedProduct",
                        params: {
                            product,
                        },
                    },
                    {
                        key:
                            "findings.outdatedSoftware.evidence.detectedVersion",
                        params: {
                            version,
                        },
                    },
                    {
                        key:
                            "findings.outdatedSoftware.evidence.minimumBaseline",
                        params: {
                            version:
                                rule.minimumVersion,
                        },
                    },
                ],

                port: inspection.port,
                service: inspection.service,
                confidence: 0.9,
            });
        }

        return findings;
    }
}

const outdatedSoftware: SoftwareVersionRule[] = [
    {
        product: "nginx",
        minimumVersion: "1.25.0",
        severity: "medium",
        reasonKey:
            "findings.outdatedSoftware.reasons.nginx",
    },
    {
        product: "redis",
        minimumVersion: "7.0.0",
        severity: "medium",
        reasonKey:
            "findings.outdatedSoftware.reasons.redis",
    },
];