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

        const matchedRules =
            FingerprintRules
                .filter(rule => {

                    if (
                        rule.services &&
                        !rule.services.includes(
                            evidence.service
                        )
                    ) {
                        return false;
                    }

                    return rule.match(evidence);
                })
                .map(rule => ({
                    rule,
                    confidence:
                        rule.confidence(evidence)
                }))
                .filter(
                    ({ confidence }) =>
                        confidence > 0
                )
                .sort(
                    (a, b) =>
                        b.confidence -
                        a.confidence
                );

        if (
            matchedRules.length === 0
        ) {
        return {

            port: port.port,

            service: port.service,

            ...(port.product !== undefined
                ? { product: port.product }
                : {}),

            ...(port.version !== undefined
                ? { version: port.version }
                : {}),

            confidence: 0,

            vendor: "Unknown",

            category: "Unknown",

            technologies: evidence.technologies ?? [],

            evidence: []
        };
        }

        const specificRules =
            matchedRules.filter(
                ({ rule }) =>
                    !rule.fallback
            );

        const usableRules =
            specificRules.length > 0
                ? specificRules
                : matchedRules;

        const primary =
            usableRules[0]!;

        const product =
            primary.rule.result.product ??
            port.product;

        const version =
            port.version;

        return {
            port: port.port,
            service: port.service,

            ...(product !== undefined
                ? { product }
                : {}),

            ...(version !== undefined
                ? { version }
                : {}),

            confidence: primary.confidence,

            vendor:
                primary.rule.result.vendor,

            category:
                primary.rule.result.category,

            technologies:
                evidence.technologies ?? [],

            evidence:
                usableRules.map(
                    ({ rule, confidence }) =>
                        `${rule.id} (${confidence}%)`
                )
        };
    }
}