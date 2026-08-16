import type {
    ScanTarget,
} from "../types/scan.types.js";

import {
    classifyNetworkError,
} from "../utils/classify-network-error.js";

import {
    scannerConcurrency,
} from "./concurrency.js";

import { runConcurrent } 
    from "../utils/run-concurrent.js";

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

            const totalStart =
                performance.now();

            const discoveryStart =
                performance.now();

            const discovery =
                await this.nmap.discoverHosts(
                    target.host
                );

            const discoveryMs =
                Math.round(
                    performance.now() -
                    discoveryStart
                );

            if (discovery.exitCode !== 0) {

                throw new Error(
                    discovery.stderr ||
                    `Nmap host discovery failed with code ${discovery.exitCode}`
                );
            }

            if (!discovery.hosts.includes(target.host)) {

                await this.targetRepository.markCompleted(
                    target.id,
                    {
                        host: target.host,
                        ports: []
                    }
                );

                await this.jobRepository.incrementProgress(
                    target.jobId,
                    true
                );

                console.log(
                    `[ScanWorker] host down ${target.host}`,
                    {
                        discoveryMs
                    }
                );

                return;
            }

            
            const nmapStart = performance.now();
            
            const nmapMs = Math.round(
                performance.now() - nmapStart
            );

            const nmap = await this.nmap.scan(target.host);

            if (nmap.exitCode !== 0) {

                throw new Error(
                    nmap.stderr ||
                    `Nmap exited with code ${nmap.exitCode}`
                );
            }

            const parseStart = performance.now();

            const result =
                this.parser.parse(
                    nmap.stdout
                );

            const parseMs =
                Math.round(
                    performance.now() - parseStart
                );

            await this.targetRepository.markInspecting(
                target.id
            );

            const inspections: InspectionResult[] = [];

            const inspectorTasks = [];

            for (const port of result.ports) {

                if (port.state !== "open") {
                    continue;
                }

                const matching =
                    this.inspectors.all.filter(
                        inspector =>
                            inspector.supports(port)
                    );

                for (const inspector of matching) {

                    inspectorTasks.push({
                        inspector,
                        port,
                    });

                }
            }

            const inspectorStart = performance.now();
            
            await runConcurrent(
                inspectorTasks,
                scannerConcurrency.maxConcurrentInspectors,
                async ({ inspector, port }) => {
                    
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

                        const failure =
                            classifyNetworkError(error);

                        if (failure.expected) {

                            return;
                        }

                        console.warn(
                            `[Inspector] ${inspector.constructor.name} ` +
                            `${result.host}:${port.port} ` +
                            `${failure.category}: ${failure.message}`
                        );

                    }

                }
            );

            const inspectorMs = Math.round(
                performance.now() - inspectorStart
            );

            await this.targetRepository.markFingerprinting(
                target.id
            );

            const analysisStart =
                performance.now();

            this.analyzer.analyze(
                result,
                inspections
            );

            const analysisMs =
                Math.round(
                    performance.now() - analysisStart
                );

            const totalMs = Math.round(
                performance.now() - totalStart
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
                `[ScanWorker] completed ${target.host}`,
                {
                    totalMs,
                    discoveryMs,
                    nmapMs,
                    parseMs,
                    inspectorMs,
                    analysisMs,
                    ports: result.ports.length,
                    inspections: inspections.length,
                }
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