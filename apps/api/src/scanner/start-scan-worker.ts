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
            `[BullMQ] scan target completed: ${job.id}`
        );

        console.log(
            new Date().toISOString()
        );

        console.log(
            "========================================"
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