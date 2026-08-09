import type { ScanResult } from "../types/scan.types.js";

import { EvidenceBuilder } from "../fingerprint/evidence.builder.js";
import { FingerprintEngine } from "../fingerprint/fingerprint.engine.js";
import { RiskEngine } from "../risk/risk.engine.js";

import type { InspectionResult } from "../inspectors/inspector.interface.js";
import type { PortInspections } from "../inspection/types.js";

import { SummaryBuilder } from "./summary.builder.js";

import { InfrastructureEngine } from "../infrastructure/infrastructure.engine.js";

import { HostInfrastructureEngine }
    from "../infrastructure/host-infrastructure.engine.js";

import { HostRiskEngine } from "../risk/host-risk.engine.js";

import type {
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

        return {

            host:
                result.host,

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
                hostRisk
        };
    }
}