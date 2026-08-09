import type { FingerprintEvidence } from "../fingerprint/evidence.types.js";
import type { ScanPort } from "../types/scan.types.js";
import type { PortInspections } from "../inspection/types.js";
import type { RiskResult } from "./types.js";
import type { ServiceFingerprint } from "../fingerprint/fingerprint.types.js";
import type { InfrastructureAnalysis } from "../infrastructure/infrastructure.types.js";

export interface PortAnalysisInput {
    port: ScanPort;
    evidence: FingerprintEvidence;
    fingerprint: ServiceFingerprint;
    inspections: PortInspections;
    infrastructure: InfrastructureAnalysis;
}

export class RiskEngine {

    analyze({
        port,
        evidence,
        inspections,
        fingerprint,
        infrastructure
    }: PortAnalysisInput): RiskResult {

        switch (port.service) {

            case "domain":
                return {
                    level: "Info",
                    reason:
                        fingerprint.product
                            ? `DNS server exposed (${fingerprint.product}).`
                            : "DNS service exposed.",
                    code: "DNS-EXPOSED"
                };

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
                return {
                    level: "High",
                    reason: "MySQL database is publicly accessible.",
                    code: "MYSQL-EXPOSED"
                };

            case "postgresql":
                return {
                    level: "High",
                    reason: "PostgreSQL database is publicly accessible.",
                    code: "POSTGRESQL-EXPOSED"
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
                    inspections,
                    infrastructure
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
        inspections: PortInspections,
        infrastructure: InfrastructureAnalysis
    ): RiskResult {

        if (
            this.isBehindCdn(infrastructure)
        ) {
            return {
                level: "Info",
                reason:
                    "HTTP service is exposed behind a CDN with hidden origin.",
                code: "HTTP-CDN-EDGE"
            };
        }

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

        /*
        * Direct unencrypted HTTP.
        */
        return {
            level: "Medium",
            reason:
                "HTTP service is exposed without encryption.",
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

    private isBehindCdn(
        infrastructure: InfrastructureAnalysis
    ): boolean {

        return (
            infrastructure.type === "cdn" &&
            infrastructure.originVisibility === "hidden"
        );
    }
}