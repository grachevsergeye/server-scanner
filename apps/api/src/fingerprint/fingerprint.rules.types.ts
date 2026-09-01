import type { FingerprintEvidence } from "./evidence.types.js";

export interface FingerprintRule {
    id: string;

    services: string[];

    fallback?: boolean;

    match: (
        evidence: FingerprintEvidence
    ) => boolean;

    confidence: (
        evidence: FingerprintEvidence
    ) => number;

    result: {
        vendor: string;
        category: string;
        product?: string;
    };
}