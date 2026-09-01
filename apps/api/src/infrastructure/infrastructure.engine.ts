import type { FingerprintEvidence } from "../fingerprint/evidence.types.js";
import type {
    InfrastructureAnalysis
} from "./infrastructure.types.js";

export class InfrastructureEngine {

    analyze(
        evidence: FingerprintEvidence
    ): InfrastructureAnalysis {

        const evidenceList: string[] = [];

        let confidence = 0;

        /*
         * Cloudflare detection
         */

        const server =
            evidence.server?.toLowerCase();

        const cfRay =
            evidence.headers?.["cf-ray"];

        const certificateOrganization =
            evidence.certificate
                ?.subject
                ?.organization
                ?.toLowerCase();

        /*
         * Cloudflare signals
         */

        if (server === "cloudflare") {

            confidence += 50;

            evidenceList.push(
                "server: cloudflare (+50)"
            );
        }

        if (cfRay) {

            confidence += 35;

            evidenceList.push(
                "cf-ray header (+35)"
            );
        }

        if (
            certificateOrganization
                ?.includes("cloudflare")
        ) {

            confidence += 30;

            evidenceList.push(
                "TLS certificate organization: Cloudflare (+30)"
            );
        }

        /*
         * Cloudflare detected
         */

        if (confidence > 0) {

            return {

                type: "cdn",

                originVisibility: "hidden",

                vendor: "Cloudflare",

                technologies: [
                    "Cloudflare"
                ],

                confidence:
                    Math.min(confidence, 100),

                evidence:
                    evidenceList

            };
        }

        /*
         * Nothing detected
         */

        return {

            type: "direct",

            originVisibility: "unknown",

            technologies: [],

            confidence: 0,

            evidence: []

        };
    }
}