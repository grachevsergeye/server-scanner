import { ScanWorker } from "../workers/scan.worker.js";
import { NmapParser } from "../parsers/nmap.parser.js";
import { InspectorRegistry } from "../inspectors/inspector.registry.js";
import type { InspectionResult } from "../inspectors/inspector.interface.js";
import { ScanAnalyzer } from "../analysis/scan.analyzer.js";
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

        console.log(
            "[ScanService] parsed ports:",
            result.ports.map(port => ({
                port: port.port,
                state: port.state,
                service: port.service,
                product: port.product,
                version: port.version,
                nmapConfidence: port.nmapConfidence
            }))
        );

        const inspections: InspectionResult[] = [];

        for (const port of result.ports) {

            console.log(
                `[ScanService] checking inspectors for ${port.port}/${port.service}`,
                {
                    state: port.state,
                    service: port.service
                }
            );

            const matchingInspectors =
                this.inspectors.all.filter(
                    inspector =>
                        inspector.supports(port)
                );

            console.log(
                `[ScanService] matched inspectors for ${port.port}:`,
                matchingInspectors.map(
                    inspector =>
                        inspector.constructor.name
                )
            );

            for (
                const inspector
                of matchingInspectors
            ) {

                try {

                    console.log(
                        `[ScanService] running ${inspector.constructor.name} on ${result.host}:${port.port}`
                    );

                    const inspection =
                        await inspector.inspect(
                            result.host,
                            port
                        );

                    console.log(
                        `[ScanService] inspection result ${result.host}:${port.port}:`,
                        inspection
                    );

                    inspections.push(
                        inspection
                    );

                } catch (error) {

                    console.error(
                        `[Inspector] ${inspector.constructor.name} failed on ${result.host}:${port.port}`,
                        error
                    );

                }

            }

        }

        console.log(
            "[ScanService] all inspections:",
            inspections
        );

        const analysis =
            this.analyzer.analyze(
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