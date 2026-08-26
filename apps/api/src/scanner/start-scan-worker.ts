import {
    createScanQueueWorker,
} from "./scan.queue.js";

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
            "========================================"
        );

        console.log(
            "[SCAN WORKER STARTED - NEW CODE]"
        );

        console.log(
            new Date().toISOString()
        );

        console.log(
            "========================================"
        );

        console.log(
            `[BullMQ] queue job completed: ${job.id}`
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