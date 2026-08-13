import crypto from "node:crypto";

import type {
    ScanJob,
} from "../../types/scan.types.js";

import type {
    CreateScanJobData,
    UpdateScanJobData,
    ScanJobRepository,
} from "./scan-job.repository.js";

export class InMemoryScanJobRepository
    implements ScanJobRepository {

    private readonly jobs =
        new Map<string, ScanJob>();

    async create(
        data: CreateScanJobData
    ): Promise<ScanJob> {

        const job: ScanJob = {
            id: crypto.randomUUID(),

            status: data.status,

            totalTargets:
                data.totalTargets,

            completedTargets:
                data.completedTargets,

            failedTargets:
                data.failedTargets,

            createdAt:
                new Date(),
        };

        this.jobs.set(
            job.id,
            job
        );

        return job;
    }

    async findById(
        id: string
    ): Promise<ScanJob | null> {

        return this.jobs.get(id) ?? null;
    }

    async update(
        id: string,
        data: UpdateScanJobData
    ): Promise<ScanJob> {

        const job =
            this.jobs.get(id);

        if (!job) {
            throw new Error(
                `Scan job ${id} not found`
            );
        }

        Object.assign(
            job,
            data
        );

        return job;
    }

    async incrementProgress(
        id: string,
        success: boolean
    ): Promise<ScanJob> {

        const job =
            this.jobs.get(id);

        if (!job) {
            throw new Error(
                `Scan job ${id} not found`
            );
        }

        if (success) {
            job.completedTargets++;
        } else {
            job.failedTargets++;
        }

        const finished =
            job.completedTargets +
            job.failedTargets;

        if (finished >= job.totalTargets) {

            job.status =
                job.failedTargets > 0 &&
                job.completedTargets === 0
                    ? "failed"
                    : "completed";

            job.completedAt =
                new Date();
        }

        return job;
    }
}