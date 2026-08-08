import type { FingerprintEvidence } from "../fingerprint/evidence.types.js";
import type { ScanPort } from "../types/scan.types.js";
import type { PortInspections } from "../inspection/types.js";
import type { RiskResult } from "./types.js";

export interface PortAnalysisInput {
    port: ScanPort;
    evidence: FingerprintEvidence;
    inspections: PortInspections;
}

export class RiskEngine {

    analyze({
        port,
        evidence,
        inspections
    }: PortAnalysisInput): RiskResult {

        switch (port.service) {

            case "redis":
                return {
                    level: "Critical",
                    reason: "Redis is exposed to the Internet.",
                    code: "REDIS-EXPOSED"
                };

            case "mongodb":
                return {
                    level: "Critical",
                    reason: "MongoDB is publicly accessible.",
                    code: "MONGODB-EXPOSED"
                };

            case "mysql":
            case "postgresql":
                return {
                    level: "High",
                    reason: "Database service exposed.",
                    code: "DATABASE-EXPOSED"
                };

            case "ftp":
                return {
                    level: "High",
                    reason: "FTP transmits credentials unencrypted.",
                    code: "FTP-UNENCRYPTED"
                };

            case "telnet":
                return {
                    level: "Critical",
                    reason: "Telnet is insecure.",
                    code: "TELNET-INSECURE"
                };

            case "ssh":
                return {
                    level: "Low",
                    reason: "Remote administration service exposed.",
                    code: "SSH-EXPOSED"
                };

            case "http":
                return this.analyzeHttp(
                    port,
                    inspections
                );

            case "https":
                return this.analyzeHttps(
                    inspections
                );

            default:
                return {
                    level: "Info",
                    reason: "Unknown service.",
                    code: "UNKNOWN-SERVICE"
                };
        }
    }

    private analyzeHttp(
        port: ScanPort,
        inspections: PortInspections
    ): RiskResult {

        /*
         * Nmap says SSL OR TLS inspector confirmed TLS.
         */
        if (
            port.tunnel === "ssl" ||
            inspections.tls
        ) {
            return {
                level: "Info",
                reason: "Encrypted web service.",
                code: "HTTP-ENCRYPTED"
            };
        }

        /*
         * HTTP redirects to HTTPS.
         */
        if (
            this.redirectsToHttps(
                inspections.redirects
            )
        ) {
            return {
                level: "Info",
                reason: "HTTP redirects to HTTPS.",
                code: "HTTP-REDIRECTS-HTTPS"
            };
        }

        return {
            level: "Medium",
            reason: "HTTP service is exposed without encryption.",
            code: "HTTP-UNENCRYPTED"
        };
    }

    private analyzeHttps(
        inspections: PortInspections
    ): RiskResult {

        if (inspections.tls) {
            return {
                level: "Info",
                reason: "Encrypted web service.",
                code: "HTTPS-ENCRYPTED"
            };
        }

        return {
            level: "Info",
            reason: "HTTPS service detected.",
            code: "HTTPS"
        };
    }

    private redirectsToHttps(
        redirects?: PortInspections["redirects"]
    ): boolean {

        if (!redirects?.redirects.length) {
            return false;
        }

        return redirects.redirects.some(
            redirect => {

                try {

                    const url =
                        new URL(
                            redirect.location,
                            redirect.url
                        );

                    return url.protocol === "https:";

                } catch {

                    return false;

                }

            }
        );
    }
}