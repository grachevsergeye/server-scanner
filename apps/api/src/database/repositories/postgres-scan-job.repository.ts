import type {
    ScanJob,
    ScanJobStatus,
} from "../../types/scan.types.js";

import type {
    CreateScanJobData,
    UpdateScanJobData,
    ScanJobRepository,
    ScanHistorySummary
} from "./scan-job.repository.js";

import { postgres } from "../postgres.js";

export class PostgresScanJobRepository
    implements ScanJobRepository {

    async create(
        data: CreateScanJobData
    ): Promise<ScanJob> {

        const result = await postgres.query(
            `
            INSERT INTO scan_jobs (
                status,
                total_targets,
                completed_targets,
                failed_targets
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                data.status,
                data.totalTargets,
                data.completedTargets,
                data.failedTargets,
            ]
        );

        return this.mapRow(result.rows[0]);
    }

    async findById(
        id: string
    ): Promise<ScanJob | null> {

        const result = await postgres.query(
            `
            SELECT *
            FROM scan_jobs
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRow(result.rows[0]);
    }

    async findByJobId(
        id: string
    ): Promise<ScanJob | null> {

        const result = await postgres.query(
            `
            SELECT *
            FROM scan_jobs
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRow(result.rows[0]);
    }

    async findRecent(
        limit: number
    ): Promise<ScanHistorySummary[]> {
        const jobsResult = await postgres.query(
            `
            SELECT
                id,
                status,
                total_targets,
                completed_targets,
                failed_targets,
                created_at,
                started_at,
                completed_at
            FROM scan_jobs
            ORDER BY created_at DESC
            LIMIT $1
            `,
            [limit]
        );

        if (jobsResult.rows.length === 0) {
            return [];
        }

        const jobIds = jobsResult.rows.map(
            (row) => row.id
        );

        const targetsResult = await postgres.query(
            `
            SELECT
                job_id,
                host,
                status,
                host_state,
                created_at
            FROM scan_targets
            WHERE job_id = ANY($1::uuid[])
            ORDER BY created_at ASC
            `,
            [jobIds]
        );

        const portResult = await postgres.query(
            `
            SELECT
                st.job_id,
                COUNT(sp.id)::integer AS port_count
            FROM scan_targets st
            LEFT JOIN scan_ports sp
                ON sp.scan_target_id = st.id
            WHERE st.job_id = ANY($1::uuid[])
            GROUP BY st.job_id
            `,
            [jobIds]
        );

        const findingResult = await postgres.query(
            `
            SELECT
                st.job_id,
                COUNT(sf.id)::integer AS finding_count
            FROM scan_targets st
            LEFT JOIN scan_findings sf
                ON sf.scan_target_id = st.id
            WHERE st.job_id = ANY($1::uuid[])
            GROUP BY st.job_id
            `,
            [jobIds]
        );

        const targetsByJob = new Map<
            string,
            ScanHistorySummary["targets"]
        >();

        for (const row of targetsResult.rows) {
            const existing =
                targetsByJob.get(row.job_id) ?? [];

            existing.push({
                host: row.host,
                status: row.status,
                hostState:
                    row.host_state ?? undefined,
            });

            targetsByJob.set(
                row.job_id,
                existing
            );
        }

        const portsByJob =
            new Map<string, number>();

        for (const row of portResult.rows) {
            portsByJob.set(
                row.job_id,
                row.port_count
            );
        }

        const findingsByJob =
            new Map<string, number>();

        for (const row of findingResult.rows) {
            findingsByJob.set(
                row.job_id,
                row.finding_count
            );
        }

        return jobsResult.rows.map((row) => ({
            id: row.id,
            status: row.status,
            totalTargets: row.total_targets,
            completedTargets:
                row.completed_targets,
            failedTargets:
                row.failed_targets,
            createdAt:
                new Date(row.created_at),

            ...(row.started_at
                ? {
                    startedAt:
                        new Date(row.started_at),
                }
                : {}),

            ...(row.completed_at
                ? {
                    completedAt:
                        new Date(row.completed_at),
                }
                : {}),

            targets:
                targetsByJob.get(row.id) ?? [],

            portCount:
                portsByJob.get(row.id) ?? 0,

            findingCount:
                findingsByJob.get(row.id) ?? 0,
        }));
    }

    async update(
        id: string,
        data: UpdateScanJobData
    ): Promise<ScanJob> {

        const fields: string[] = [];
        const values: unknown[] = [];

        if (data.status !== undefined) {
            fields.push(`status = $${values.length + 1}`);
            values.push(data.status);
        }

        if (data.completedTargets !== undefined) {
            fields.push(
                `completed_targets = $${values.length + 1}`
            );
            values.push(data.completedTargets);
        }

        if (data.failedTargets !== undefined) {
            fields.push(
                `failed_targets = $${values.length + 1}`
            );
            values.push(data.failedTargets);
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

        if (data.error !== undefined) {
            fields.push(
                `error = $${values.length + 1}`
            );
            values.push(data.error);
        }

        if (fields.length === 0) {
            const existing = await this.findById(id);

            if (!existing) {
                throw new Error(
                    `Scan job ${id} not found`
                );
            }

            return existing;
        }

        values.push(id);

        const result = await postgres.query(
            `
            UPDATE scan_jobs
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING *
            `,
            values
        );

        if (result.rows.length === 0) {
            throw new Error(
                `Scan job ${id} not found`
            );
        }

        return this.mapRow(result.rows[0]);
    }

    async incrementProgress(
        id: string,
        success: boolean
    ): Promise<ScanJob> {

        const result = await postgres.query(
            `
            UPDATE scan_jobs
            SET
                completed_targets =
                    completed_targets +
                    CASE WHEN $2 THEN 1 ELSE 0 END,

                failed_targets =
                    failed_targets +
                    CASE WHEN $2 THEN 0 ELSE 1 END,

                status =
                    CASE
                        WHEN
                            completed_targets +
                            failed_targets +
                            1 >= total_targets
                        THEN
                            CASE
                                WHEN
                                    failed_targets +
                                    CASE WHEN $2 THEN 0 ELSE 1 END > 0
                                    AND
                                    completed_targets +
                                    CASE WHEN $2 THEN 1 ELSE 0 END = 0
                                THEN 'failed'
                                ELSE 'completed'
                            END
                        ELSE status
                    END,

                completed_at =
                    CASE
                        WHEN
                            completed_targets +
                            failed_targets +
                            1 >= total_targets
                        THEN NOW()
                        ELSE completed_at
                    END

            WHERE id = $1

            RETURNING *
            `,
            [id, success]
        );

        if (result.rows.length === 0) {
            throw new Error(
                `Scan job ${id} not found`
            );
        }

        return this.mapRow(result.rows[0]);
    }

    private mapRow(row: any): ScanJob {
        const job: ScanJob = {
            id: row.id,

            status:
                row.status as ScanJobStatus,

            totalTargets:
                row.total_targets,

            completedTargets:
                row.completed_targets,

            failedTargets:
                row.failed_targets,

            createdAt:
                new Date(row.created_at),
        };

        if (row.started_at !== null) {
            job.startedAt =
                new Date(row.started_at);
        }

        if (row.completed_at !== null) {
            job.completedAt =
                new Date(row.completed_at);
        }

        if (row.error !== null) {
            job.error =
                row.error;
        }

        return job;
    }
}