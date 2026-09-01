import type {
    ScanTarget,
    ScanTargetStatus,
} from "../../types/scan.types.js";

import type {
    CreateScanTargetData,
    UpdateScanTargetData,
    ScanTargetRepository,
    CompleteScanTargetData,
} from "./scan-target.repository.js";

import { postgres } from "../postgres.js";

export class PostgresScanTargetRepository
    implements ScanTargetRepository {

    async createMany(
        data: CreateScanTargetData[]
    ): Promise<ScanTarget[]> {

        const targets: ScanTarget[] = [];

        for (const item of data) {

            const result = await postgres.query(
                `
                INSERT INTO scan_targets (
                    job_id,
                    host,
                    status
                )
                VALUES ($1, $2, $3)
                RETURNING *
                `,
                [
                    item.jobId,
                    item.host,
                    item.status,
                ]
            );

            targets.push(
                this.mapRow(result.rows[0])
            );
        }

        return targets;
    }

    async findById(
        targetId: string
    ): Promise<ScanTarget | null> {
        const result = await postgres.query(
            `
            SELECT *
            FROM scan_targets
            WHERE id = $1
            `,
            [targetId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRow(result.rows[0]);
    }

    async findByJobId(
        jobId: string
    ): Promise<ScanTarget[]> {
        const result = await postgres.query(
            `
            SELECT *
            FROM scan_targets
            WHERE job_id = $1
            ORDER BY created_at ASC
            `,
            [jobId]
        );

        return result.rows.map((row) => this.mapRow(row));
    }

    async update(
        id: string,
        data: UpdateScanTargetData
    ): Promise<ScanTarget> {

        const fields: string[] = [];
        const values: unknown[] = [];

        if (data.status !== undefined) {
            fields.push(
                `status = $${values.length + 1}`
            );
            values.push(data.status);
        }

        if (data.error !== undefined) {
            fields.push(
                `error = $${values.length + 1}`
            );
            values.push(data.error);
        }

        if (data.result !== undefined) {
            fields.push(
                `result = $${values.length + 1}`
            );

            values.push(
                JSON.stringify(data.result)
            );
        }

        if (data.inspections !== undefined) {
            fields.push(
                `inspections = $${values.length + 1}`
            );

            values.push(
                JSON.stringify(data.inspections)
            );
        }

        if (data.analysis !== undefined) {
            fields.push(
                `analysis = $${values.length + 1}`
            );

            values.push(
                JSON.stringify(data.analysis)
            );
        }

        if (data.startedAt !== undefined) {
            fields.push(
                `started_at = $${values.length + 1}`
            );

            values.push(data.startedAt);
        }

        if (data.completedAt !== undefined) {
            fields.push(
                `completed_at = $${values.length + 1}`
            );

            values.push(data.completedAt);
        }

        if (fields.length === 0) {
            const result = await postgres.query(
                `
                SELECT *
                FROM scan_targets
                WHERE id = $1
                `,
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error(
                    `Scan target ${id} not found`
                );
            }

            return this.mapRow(result.rows[0]);
        }

        values.push(id);

        const result = await postgres.query(
            `
            UPDATE scan_targets
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING *
            `,
            values
        );

        if (result.rows.length === 0) {
            throw new Error(
                `Scan target ${id} not found`
            );
        }

        return this.mapRow(result.rows[0]);
    }

    async markScanning(
        id: string
    ): Promise<ScanTarget> {

        return this.update(id, {
            status: "scanning",
            startedAt: new Date(),
        });
    }

    async markInspecting(
        id: string
    ): Promise<ScanTarget> {

        return this.update(id, {
            status: "inspecting",
        });
    }

    async markFingerprinting(
        id: string
    ): Promise<ScanTarget> {

        return this.update(id, {
            status: "fingerprinting",
        });
    }

    async markRisk(
        id: string
    ): Promise<ScanTarget> {

        return this.update(id, {
            status: "risk",
        });
    }

    async markCompleted(
        data: CompleteScanTargetData
    ): Promise<ScanTarget> {
        return this.update(data.targetId, {
            status: "completed",
            result: data.scan,
            inspections: data.inspections,
            analysis: data.analysis,
            completedAt: new Date(),
        });
    }

    async markFailed(
        id: string,
        error: string
    ): Promise<ScanTarget> {

        return this.update(id, {
            status: "failed",
            error,
            completedAt: new Date(),
        });
    }

    private mapRow(row: any): ScanTarget {
        const target: ScanTarget = {
            id: row.id,

            jobId:
                row.job_id,

            host:
                row.host,

            status:
                row.status as ScanTargetStatus,

            createdAt:
                new Date(row.created_at),
        };

        if (row.result !== null) {
            target.result =
                row.result;
        }

        if (row.inspections !== null) {
            target.inspections =
                row.inspections;
        }

        if (row.analysis !== null) {
            target.analysis =
                row.analysis;
        }

        if (row.error !== null) {
            target.error =
                row.error;
        }

        if (row.started_at !== null) {
            target.startedAt =
                new Date(row.started_at);
        }

        if (row.completed_at !== null) {
            target.completedAt =
                new Date(row.completed_at);
        }

        return target;
    }
}