import type { FingerprintEvidence } from "../fingerprint/evidence.types.js";
import type { ScanPort } from "../types/scan.types.js";
import type { PortInspections } from "../inspection/types.js";
import type { ServiceFingerprint } from "../fingerprint/fingerprint.types.js";
import type { InfrastructureAnalysis } from "../infrastructure/infrastructure.types.js";
import { RISK_DEFINITIONS } from "./definitions.js";

import type {
    RiskResult
} from "./types.js";

import type {
    RiskCode
} from "./definitions.js";

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

        if (port.state !== "open") {
            return this.analyzeNonOpenPort(
                port,
                fingerprint
            );
        }

        switch (port.service) {

            case "domain":
                return this.result(
                    "DNS-EXPOSED",
                    fingerprint.confidence,
                    fingerprint.product
                        ? `DNS server exposed (${fingerprint.product}).`
                        : "DNS service exposed."
                );

            case "redis":
                return this.result(
                    "REDIS-EXPOSED",
                    fingerprint.confidence
                );

            case "mongodb":
                return this.result(
                    "MONGODB-EXPOSED",
                    fingerprint.confidence
                );

            case "mysql":
                return this.result(
                    "MYSQL-EXPOSED",
                    fingerprint.confidence,
                    fingerprint.product
                        ? `MySQL-compatible database exposed (${fingerprint.product}).`
                        : "MySQL-compatible database exposed."
                );

            case "postgresql":
                return this.result(
                    "POSTGRESQL-EXPOSED",
                    fingerprint.confidence
                );

            case "memcached":
                return this.result(
                    "MEMCACHED-EXPOSED",
                    fingerprint.confidence
                );

            case "ftp":
                return this.result(
                    "FTP-UNENCRYPTED",
                    fingerprint.confidence
                );

            case "telnet":
                return this.result(
                    "TELNET-INSECURE",
                    fingerprint.confidence
                );

            case "ssh":
                return this.result(
                    "SSH-EXPOSED",
                    fingerprint.confidence
                );

            case "http":
                return this.analyzeHttp(
                    port,
                    inspections,
                    infrastructure
                );

            case "https":
            case "https-alt":
                return this.analyzeHttps(
                    inspections
                );

            default:
                return this.result(
                    "UNKNOWN-SERVICE",
                    fingerprint.confidence
                );
        }
    }

    private result(
        code: RiskCode,
        confidence: number,
        reason?: string
    ): RiskResult {

        const definition =
            RISK_DEFINITIONS[code];

        return {

            level:
                definition.level,

            code,

            reason:
                reason ??
                definition.reason,

            confidence
        };
    }

    private analyzeNonOpenPort(
        port: ScanPort,
        fingerprint: ServiceFingerprint
    ): RiskResult {

        if (port.state === "filtered") {

            return this.result(
                "PORT-FILTERED",
                95,
                `Port ${port.port}/${port.protocol} is filtered by a firewall or packet filter.`
            );
        }

        return this.result(
            "PORT-CLOSED",
            95,
            `Port ${port.port}/${port.protocol} is closed.`
        );
    }

    private analyzeHttp(
        port: ScanPort,
        inspections: PortInspections,
        infrastructure: InfrastructureAnalysis
    ): RiskResult {

        if (
            this.isBehindCdn(infrastructure)
        ) {
            return this.result(
                "HTTP-CDN-EDGE",
                infrastructure.confidence
            );
        }

        if (
            port.tunnel === "ssl" ||
            inspections.tls
        ) {
            return this.result(
                "HTTP-ENCRYPTED",
                inspections.tls
                    ? 95
                    : 90
            );
        }

        if (
            this.redirectsToHttps(
                inspections.redirects
            )
        ) {
            return this.result(
                "HTTP-REDIRECTS-HTTPS",
                95
            );
        }

        return this.result(
            "HTTP-UNENCRYPTED",
            90
        );
    }

    private analyzeHttps(
        inspections: PortInspections
    ): RiskResult {

        if (inspections.tls) {
            return this.result(
                "HTTPS-ENCRYPTED",
                95
            );
        }

        return this.result(
            "HTTPS",
            90
        );
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