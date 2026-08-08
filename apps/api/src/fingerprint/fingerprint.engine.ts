import type { ScanPort } from "../types/scan.types.js";

import {
    FingerprintRules
} from "./fingerprint.rules.js";

import type {
    ServiceFingerprint
} from "./fingerprint.types.js";

import type {
    FingerprintEvidence
} from "./evidence.types.js";

export class FingerprintEngine {

    analyze(
        port: ScanPort,
        evidence: FingerprintEvidence
    ): ServiceFingerprint {

        /*
         * Find matching rules
         */

        const matchedRules = FingerprintRules
            .filter(rule => {

                /*
                 * Service-specific rules
                 */

                if (
                    rule.services &&
                    !rule.services.includes(evidence.service)
                ) {
                    return false;
                }

                /*
                 * Evidence match
                 */

                return rule.match(evidence);
            })
            .map(rule => ({
                rule,
                score: rule.score(evidence)
            }))
            .filter(
                ({ score }) => score > 0
            )
            .sort(
                (a, b) =>
                    b.score - a.score
            );

        /*
         * Unknown service
         */

        if (matchedRules.length === 0) {

            return {

                port: port.port,

                service: port.service,

                product: port.product,

                version: port.version,

                confidence: 0,

                vendor: "Unknown",

                category: "Unknown",

                technologies:
                    evidence.technologies ?? [],

                evidence: []

            };
        }

        /*
         * Calculate fingerprint confidence
         */

        const score = matchedRules.reduce(
            (total, matched) => total + matched.score,
            0
        );

        const confidence = Math.min(score, 100);

        /*
         * Highest scoring rule
         * becomes primary fingerprint
         */

        const primary =
            matchedRules[0]!;

        /*
         * Rule product takes precedence
         * over Nmap product
         */

        const product =
            primary.rule.result.product ??
            port.product;

        return {

            port: port.port,

            service: port.service,

            product,

            version: port.version,

            confidence,

            vendor:
                primary.rule.result.vendor,

            category:
                primary.rule.result.category,

            technologies: [
                ...(evidence.technologies ?? [])
            ],

            evidence:
                matchedRules.map(
                    ({ rule, score }) =>
                        `${rule.id} (+${score})`
                )

        };
    }
}