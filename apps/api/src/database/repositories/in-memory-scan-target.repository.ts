import crypto from "node:crypto";

import type {
    ScanResult,
    ScanTarget,
} from "../../types/scan.types.js";

import type {
    CreateScanTargetData,
    UpdateScanTargetData,
    ScanTargetRepository,
} from "./scan-target.repository.js";

export class InMemoryScanTargetRepository
    implements ScanTargetRepository {

    private readonly targets =
        new Map<string, ScanTarget>();

    async createMany(
        data: CreateScanTargetData[]
    ): Promise<ScanTarget[]> {

        const targets =
            data.map(item => {

                const target: ScanTarget = {
                    id: crypto.randomUUID(),

                    jobId:
                        item.jobId,

                    host:
                        item.host,

                    status:
                        item.status,

                    createdAt:
                        new Date(),
                };

                this.targets.set(
                    target.id,
                    target
                );

                return target;
            });

        return targets;
    }

    async findById(
        id: string
    ): Promise<ScanTarget | null> {

        return this.targets.get(id) ?? null;
    }

    async update(
        id: string,
        data: UpdateScanTargetData
    ): Promise<ScanTarget> {

        const target =
            this.targets.get(id);

        if (!target) {
            throw new Error(
                `Scan target ${id} not found`
            );
        }

        Object.assign(
            target,
            data
        );

        return target;
    }

    async markScanning(
        id: string
    ): Promise<ScanTarget> {

        return this.update(
            id,
            {
                status: "scanning",
                startedAt: new Date(),
            }
        );
    }

    async markInspecting(
        id: string
    ): Promise<ScanTarget> {

        return this.update(
            id,
            {
                status: "inspecting",
            }
        );
    }

    async markFingerprinting(
        id: string
    ): Promise<ScanTarget> {

        return this.update(
            id,
            {
                status: "fingerprinting",
            }
        );
    }

    async markRisk(
        id: string
    ): Promise<ScanTarget> {

        return this.update(
            id,
            {
                status: "risk",
            }
        );
    }

    async markCompleted(
        id: string,
        result: ScanResult
    ): Promise<ScanTarget> {

        return this.update(
            id,
            {
                status: "completed",

                result,

                completedAt:
                    new Date(),
            }
        );
    }

    async markFailed(
        id: string,
        error: string
    ): Promise<ScanTarget> {

        return this.update(
            id,
            {
                status: "failed",

                error,

                completedAt:
                    new Date(),
            }
        );
    }
}