import {
    createScanQueueWorker,
} from "./scan.queue.js";

import { testPostgresConnection } from "../database/postgres.js";

import {
    scanJobRepository,
    scanTargetRepository,
} from "./scanner.dependencies.js";

const worker =
    createScanQueueWorker(
        scanTargetRepository,
        scanJobRepository,
    );

worker.on(
    "completed",
    job => {

        console.log(
            `[ScanWorker] completed ${job.id}`
        );

    }
);

worker.on(
    "failed",
    (job, error) => {

        console.error(
            `[ScanWorker] failed ${job?.id}`,
            error
        );

    }
);

worker.on(
    "error",
    error => {

        console.error(
            "[ScanWorker] worker error",
            error
        );

    }
);