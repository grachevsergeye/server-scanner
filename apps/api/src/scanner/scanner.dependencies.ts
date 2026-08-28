import {
    PostgresScanJobRepository,
} from "../database/repositories/postgres-scan-job.repository.js";

import {
    PostgresScanTargetRepository,
} from "../database/repositories/postgres-scan-target.repository.js";

import {
    PostgresFindingRepository,
} from "../database/repositories/postgres-finding.repository.js";

export const scanJobRepository =
    new PostgresScanJobRepository();

export const scanTargetRepository =
    new PostgresScanTargetRepository();

export const findingRepository =
    new PostgresFindingRepository();