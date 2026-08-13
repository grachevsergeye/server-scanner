import { Queue, Worker } from "bullmq";

import type { ScanTargetRepository }
    from "../database/repositories/scan-target.repository.js";

import type { ScanJobRepository }
    from "../database/repositories/scan-job.repository.js";

import { ScanWorker } from "./scan.worker.js";

import {
    scannerConcurrency,
} from "./concurrency.js";

export interface ScanQueueJob {
    targetId: string;
    jobId: string;
}

const connection = {
    host: "localhost",
    port: 6379,
};

export const scanQueue =
    new Queue<ScanQueueJob>(
        "server-scans",
        {
            connection,
        }
    );

export function createScanQueueWorker(
    targetRepository: ScanTargetRepository,
    jobRepository: ScanJobRepository,
) {

    const scanWorker =
        new ScanWorker(
            targetRepository,
            jobRepository,
        );

    return new Worker<ScanQueueJob>(
        "server-scans",

        async job => {

            const target =
                await targetRepository.findById(
                    job.data.targetId
                );

            if (!target) {

                throw new Error(
                    `Scan target ${job.data.targetId} not found`
                );
            }

            await scanWorker.process(
                target
            );
        },

        {
            connection,

            concurrency:
                scannerConcurrency.maxConcurrentScans,
        }
    );
}