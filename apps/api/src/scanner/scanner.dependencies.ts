import {
    PostgresScanJobRepository,
} from "../database/repositories/postgres-scan-job.repository.js";

import {
    PostgresScanTargetRepository,
} from "../database/repositories/postgres-scan-target.repository.js";

export const scanJobRepository =
    new PostgresScanJobRepository();

export const scanTargetRepository =
    new PostgresScanTargetRepository();