import type { ScanResult } from "../types/scan.types.js";
import { SecurityRuleEngine } from "./security/security-rule.engine.js";

import { EvidenceBuilder } from "../fingerprint/evidence.builder.js";
import { FingerprintEngine } from "../fingerprint/fingerprint.engine.js";
import { RiskEngine } from "../risk/risk.engine.js";

import type { InspectionResult } from "../inspectors/inspector-result.types.js";
import type { PortInspections } from "../inspection/types.js";

import { SummaryBuilder } from "./summary.builder.js";

import { InfrastructureEngine } from "../infrastructure/infrastructure.engine.js";

import { HostInfrastructureEngine }
    from "../infrastructure/host-infrastructure.engine.js";

import { HostRiskEngine } from "../risk/host-risk.engine.js";

import type {
    AnalysisContext,
    PortAnalysis,
    ScanAnalysis
} from "./types.js";

export class ScanAnalyzer {

    private evidence =
        new EvidenceBuilder();

    private fingerprint =
        new FingerprintEngine();

    private hostInfrastructure =
        new HostInfrastructureEngine();

    private risk =
        new RiskEngine();

    private summary =
        new SummaryBuilder();

    private infrastructure =
        new InfrastructureEngine();
    
    private hostRisk =
        new HostRiskEngine();

    private security =
        new SecurityRuleEngine();

    private buildPortInspections(
        inspections: InspectionResult[]
    ): PortInspections {

        const result: PortInspections = {};

        for (const inspection of inspections) {

            switch (inspection.type) {

                case "http":
                    result.http =
                        inspection.data;
                    break;

                case "redirects":
                    result.redirects =
                        inspection.data;
                    break;

                case "tls":
                    result.tls =
                        inspection.data;
                    break;

                case "favicon":
                    result.favicon =
                        inspection.data;
                    break;

                case "robots":
                    result.robots =
                        inspection.data;
                    break;

                case "ftp":
                    result.ftp =
                        inspection.data;
                    break;

                case "ssh":
                    result.ssh =
                        inspection.data;
                    break;

                case "redis":
                    result.redis =
                        inspection.data;
                    break;

                case "mongodb":
                    result.mongodb =
                        inspection.data;
                    break;

                case "postgresql":
                    result.postgresql =
                        inspection.data;
                    break;

                case "memcached":
                    result.memcached =
                        inspection.data;
                    break;

                case "mysql":
                    result.mysql =
                        inspection.data;
                    break;

                case "smtp":
                    result.smtp =
                        inspection.data;
                    break;
            }
        }

        return result;
    }

    analyze(
        result: ScanResult,
        inspections: InspectionResult[]
    ): ScanAnalysis {

        console.log("[SCAN ANALYZER] analyze() called");

        const ports: PortAnalysis[] =
            result.ports.map(port => {

        const portInspections =
            inspections.filter(
                inspection =>
                    inspection.port === port.port
            );

        const inspectionData =
            this.buildPortInspections(
                portInspections
            );

        const evidence =
            this.evidence.build(
                port,
                portInspections
            );

        const fingerprint =
            this.fingerprint.analyze(
                port,
                evidence
            );

        const infrastructure =
            this.infrastructure.analyze(
                evidence
            );

        const risk =
            this.risk.analyze({
                port,
                evidence,
                inspections: inspectionData,
                fingerprint,
                infrastructure
            });

                return {

                    port,

                    inspections:
                        inspectionData,

                    fingerprint,

                    infrastructure,

                    risk

                };

            });

        const summary =
            this.summary.build(ports);

        const hostInfrastructure =
            this.hostInfrastructure.analyze(
                ports
            );

        const hostRisk =
            this.hostRisk.analyze(
                ports
            );

        const context: AnalysisContext = {
            host: result.host,
            ports: result.ports,
            inspections
        };

        console.log("[SCAN ANALYZER] calling SecurityRuleEngine");

        const findings =
            this.security.evaluate(context);

        return {
            host: result.host,

            scanStatus:
                result.scanStatus,

            ...(result.hostname
                ? {
                    hostname:
                        result.hostname
                }
                : {}),

            infrastructure:
                hostInfrastructure,

            ports,

            summary,

            risk:
                hostRisk,

            findings,

            meta: {
                startedAt:
                    result.scan?.startedAt ??
                    new Date().toISOString(),

                completedAt:
                    result.scan?.completedAt ??
                    new Date().toISOString(),

                durationMs:
                    result.scan?.durationMs ?? 0,

                portsScanned:
                    result.ports.length,

                inspectionsCompleted:
                    inspections.length
            }
        };
    }
}