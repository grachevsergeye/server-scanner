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
        const result =
            await postgres.query(
                `
                SELECT
                    sj.id,
                    sj.status,
                    sj.total_targets,
                    sj.completed_targets,
                    sj.failed_targets,
                    sj.created_at,
                    sj.started_at,
                    sj.completed_at,
                    sj.duration_ms,

                    COALESCE(
                        (
                            SELECT jsonb_agg(
                                jsonb_build_object(
                                    'host',
                                    st.host,
                                    'status',
                                    st.status,
                                    'hostState',
                                    COALESCE(
                                        st.host_state,
                                        st.result->>'state'
                                    )
                                )
                                ORDER BY st.created_at ASC
                            )
                            FROM scan_targets st
                            WHERE st.job_id = sj.id
                        ),
                        '[]'::jsonb
                    ) AS targets,

                    COALESCE(
                        (
                            SELECT SUM(
                                jsonb_array_length(
                                    COALESCE(
                                        st.result->'ports',
                                        '[]'::jsonb
                                    )
                                )
                            )
                            FROM scan_targets st
                            WHERE st.job_id = sj.id
                        ),
                        0
                    )::integer AS port_count,

                    COALESCE(
                        (
                            SELECT SUM(
                                jsonb_array_length(
                                    COALESCE(
                                        st.analysis->'findings',
                                        '[]'::jsonb
                                    )
                                )
                            )
                            FROM scan_targets st
                            WHERE st.job_id = sj.id
                        ),
                        0
                    )::integer AS finding_count

                FROM scan_jobs sj

                ORDER BY sj.created_at DESC

                LIMIT $1
                `,
                [limit]
            );

        return result.rows.map((row) => ({
            id: row.id,
            status: row.status,

            totalTargets: row.total_targets,
            completedTargets: row.completed_targets,
            failedTargets: row.failed_targets,

            createdAt: new Date(row.created_at),

            ...(row.duration_ms != null
                ? {
                    durationMs: Number(row.duration_ms),
                }
                : {}),

            ...(row.started_at
                ? {
                    startedAt: new Date(row.started_at),
                }
                : {}),

            ...(row.completed_at
                ? {
                    completedAt: new Date(row.completed_at),
                }
                : {}),

            targets: row.targets ?? [],

            portCount: row.port_count ?? 0,

            findingCount: row.finding_count ?? 0,
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
                    END,

                    duration_ms =
                        CASE
                            WHEN completed_targets +
                                failed_targets +
                                1 >= total_targets
                            THEN EXTRACT(
                                EPOCH FROM (
                                    NOW() - COALESCE(started_at, created_at)
                                )
                            ) * 1000
                            ELSE duration_ms
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

        if (row.duration_ms !== null) {
            job.durationMs =
                Number(row.duration_ms);
        }

        if (row.error !== null) {
            job.error =
                row.error;
        }

        return job;
    }
}