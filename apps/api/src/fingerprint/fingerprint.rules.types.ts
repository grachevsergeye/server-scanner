import type { FingerprintEvidence } from "./evidence.types.js";

export interface FingerprintRule {
    id: string;

    services?: string[];

    match(evidence: FingerprintEvidence): boolean;

    score(evidence: FingerprintEvidence): number;

    result: {
        vendor: string;
        category: string;
        product?: string;
    };
}