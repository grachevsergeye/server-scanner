import {
    InMemoryScanJobRepository,
} from "../database/repositories/in-memory-scan-job.repository.js";

import {
    InMemoryScanTargetRepository,
} from "../database/repositories/in-memory-scan-target.repository.js";

export const scanJobRepository =
    new InMemoryScanJobRepository();

export const scanTargetRepository =
    new InMemoryScanTargetRepository();