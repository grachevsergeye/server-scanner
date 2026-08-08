import type { ScanResult } from "../types/scan.types.js";

import { EvidenceBuilder } from "../fingerprint/evidence.builder.js";
import { FingerprintEngine } from "../fingerprint/fingerprint.engine.js";
import { RiskEngine } from "../risk/risk.engine.js";

import type { InspectionResult } from "../inspectors/inspector.interface.js";
import type { PortInspections } from "../inspection/types.js";

export class ScanAnalyzer {

    private evidence =
        new EvidenceBuilder();

    private fingerprint =
        new FingerprintEngine();

    private risk =
        new RiskEngine();

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
                case "robots":
                    break;
            }
        }

        return result;
    }

    async analyze(
        result: ScanResult,
        inspections: InspectionResult[]
    ) {

        const ports =
            result.ports.map(port => {

                const portInspections =
                    inspections.filter(
                        inspection =>
                            inspection.port ===
                            port.port
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

                const inspectionData =
                    this.buildPortInspections(
                        portInspections
                    );

                const risk =
                    this.risk.analyze({
                        port,
                        evidence,
                        inspections:
                            inspectionData
                    });

                return {
                    ...port,
                    fingerprint,
                    risk
                };

            });

        return {
            ...result,
            ports
        };
    }
}