import type {
    ScanTarget,
} from "../types/scan.types.js";

import type {
    ScanJobRepository,
} from "../database/repositories/scan-job.repository.js";

import type {
    ScanTargetRepository,
} from "../database/repositories/scan-target.repository.js";

import { scanQueue } from "../scanner/scan.queue.js";
import { expandTargets } from "../scanner/target-expander.js";

export interface CreateScanJobRequest {
    targets: string[];
}

export class ScannerService {

    constructor(

        private readonly jobRepository:
            ScanJobRepository,

        private readonly targetRepository:
            ScanTargetRepository,

    ) {}

    async createJob(
        input: CreateScanJobRequest
    ) {

        if (
            !input.targets ||
            input.targets.length === 0
        ) {

            throw new Error(
                "No scan targets supplied"
            );
        }

        const hosts =
            expandTargets(
                input.targets
            );

        if (hosts.length === 0) {

            throw new Error(
                "No scan targets supplied"
            );
        }

        console.log(
            `[ScannerService] creating scan job for ${hosts.length} targets`
        );

        const job =
            await this.jobRepository.create({

                status:
                    "queued",

                totalTargets:
                    hosts.length,

                completedTargets:
                    0,

                failedTargets:
                    0,
            });

        const targets =
            await this.targetRepository.createMany(

                hosts.map(
                    host => ({

                        jobId:
                            job.id,

                        host,

                        status:
                            "queued",
                    })
                )
            );

        await scanQueue.addBulk(

            targets.map(
                (target: ScanTarget) => ({

                    name:
                        "scan-target",

                    data: {

                        targetId:
                            target.id,

                        jobId:
                            target.jobId,
                    },
                })
            )
        );

        const runningJob = await this.jobRepository.update(
            job.id,
            {
                status: "running",
                startedAt: new Date(),
            }
        );

        return runningJob;
    }

    async getJob(
        jobId: string
    ) {
        const job =
            await this.jobRepository.findById(
                jobId
            );

        if (!job) {
            return null;
        }

        const targets =
            await this.targetRepository.findByJobId(
                jobId
            );

        return {
            ...job,
            targets,
        };
    }

    async getRecentScans(limit = 50) {
        return this.jobRepository.findRecent(limit);
    }
}