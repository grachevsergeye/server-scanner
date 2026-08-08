import { ScanWorker } from "../workers/scan.worker.js";
import { NmapParser } from "../parsers/nmap.parser.js";
import { InspectorRegistry } from "../inspectors/inspector.registry.js";
import type { InspectionResult } from "../inspectors/inspector.interface.js";
import { ScanAnalyzer } from "../analyzers/analyzer.service.js";
import type { FingerprintEvidence } from "../fingerprint/evidence.types.js";
import type { ScanPort } from "../types/scan.types.js";

export interface ScanRequest {
    ip: string;
}

export class ScanService {

    private worker = new ScanWorker();

    private parser = new NmapParser();

    private inspectors =
        new InspectorRegistry();

    private analyzer =
        new ScanAnalyzer();

    async scan(data: ScanRequest) {

        const xml =
            await this.worker.run(data.ip);

        const result =
            this.parser.parse(xml);

        const inspections: InspectionResult[] = [];

        for (const port of result.ports) {

            const matchingInspectors =
                this.inspectors.all.filter(
                    inspector =>
                        inspector.supports(port)
                );

            for (
                const inspector
                of matchingInspectors
            ) {

                try {

                    inspections.push(
                        await inspector.inspect(
                            result.host,
                            port
                        )
                    );

                } catch (error) {

                    console.error(
                        `[Inspector] ${inspector.constructor.name} failed on ${result.host}:${port.port}`,
                        error
                    );

                }

            }

        }

        const analysis =
            await this.analyzer.analyze(
                result,
                inspections
            );

        return {

            id: crypto.randomUUID(),

            result,

            inspections,

            analysis

        };

    }

}

export interface PortAnalysisInput {
    port: ScanPort;
    evidence: FingerprintEvidence;
    inspections: InspectionResult[];
}