import type {
    ScanTarget,
} from "../types/scan.types.js";

import type {
    InspectionResult,
} from "../inspectors/inspector.interface.js";

import type {
    ScanJobRepository,
} from "../database/repositories/scan-job.repository.js";

import type {
    ScanTargetRepository,
} from "../database/repositories/scan-target.repository.js";

import { NmapService }
    from "./nmap.service.js";

import { NmapParser }
    from "../parsers/nmap.parser.js";

import { InspectorRegistry }
    from "../inspectors/inspector.registry.js";

import { ScanAnalyzer }
    from "../analysis/scan.analyzer.js";

export class ScanWorker {

    constructor(

        private readonly targetRepository:
            ScanTargetRepository,

        private readonly jobRepository:
            ScanJobRepository,

        private readonly nmap =
            new NmapService(),

        private readonly parser =
            new NmapParser(),

        private readonly inspectors =
            new InspectorRegistry(),

        private readonly analyzer =
            new ScanAnalyzer(),
    ) {}

    async process(
        target: ScanTarget
    ): Promise<void> {

        try {

            await this.targetRepository.markScanning(
                target.id
            );

            const nmap =
                await this.nmap.scan(
                    target.host
                );

            if (nmap.exitCode !== 0) {

                throw new Error(
                    nmap.stderr ||
                    `Nmap exited with code ${nmap.exitCode}`
                );
            }

            const result =
                this.parser.parse(
                    nmap.stdout
                );

            await this.targetRepository.markInspecting(
                target.id
            );

            const inspections:
                InspectionResult[] = [];

            for (
                const port
                of result.ports
            ) {

                const matching =
                    this.inspectors.all.filter(
                        inspector =>
                            inspector.supports(port)
                    );

                for (
                    const inspector
                    of matching
                ) {

                    try {

                        const inspection =
                            await inspector.inspect(
                                result.host,
                                port
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

            await this.targetRepository.markFingerprinting(
                target.id
            );

            const analysis =
                this.analyzer.analyze(
                    result,
                    inspections
                );

            await this.targetRepository.markRisk(
                target.id
            );

            await this.targetRepository.markCompleted(
                target.id,
                result
            );

            await this.jobRepository.incrementProgress(
                target.jobId,
                true
            );

            console.log(
                `[ScanWorker] completed ${target.host}`
            );

        } catch (error) {

            const message =
                error instanceof Error
                    ? error.message
                    : String(error);

            console.error(
                `[ScanWorker] failed ${target.host}: ${message}`
            );

            await this.targetRepository.markFailed(
                target.id,
                message
            );

            await this.jobRepository.incrementProgress(
                target.jobId,
                false
            );

            throw error;
        }
    }
}