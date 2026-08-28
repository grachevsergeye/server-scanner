import type {
    Finding,
    FindingRepository,
} from "./finding.repository.js";

import { postgres } from "../postgres.js";

import type { ScanHistorySummary } from "./scan-job.repository.js";

export class PostgresFindingRepository
    implements FindingRepository {

    async findByJobId(
        jobId: string
    ): Promise<Finding[]> {

        const result = await postgres.query(
            `
            SELECT
                id,
                job_id,
                target_id,
                host,
                analysis,
                created_at
            FROM scan_targets
            WHERE job_id = $1
              AND analysis IS NOT NULL
            ORDER BY created_at ASC
            `,
            [jobId]
        );

        const findings: Finding[] = [];

        for (const row of result.rows) {
            const analysis = row.analysis;

            if (
                !analysis ||
                !Array.isArray(analysis.findings)
            ) {
                continue;
            }

            for (const finding of analysis.findings) {
                findings.push({
                    id: finding.id,
                    jobId: row.job_id,
                    targetId: row.target_id,
                    host: row.host,
                    port: finding.port,
                    service: finding.service,
                    severity: finding.severity,
                    title: finding.title,
                    description: finding.description,
                    evidence: finding.evidence ?? [],
                    confidence: finding.confidence,
                    createdAt: new Date(row.created_at),
                });
            }
        }

        return findings;
    }

    async findRecent(
        limit = 50
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
            row => row.id
        );

        const targetsResult = await postgres.query(
            `
            SELECT
                id,
                job_id,
                host,
                status,
                host_state
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

        const targetsByJob = new Map<string, any[]>();

        for (const row of targetsResult.rows) {
            const existing =
                targetsByJob.get(row.job_id) ?? [];

            existing.push({
                host: row.host,
                status: row.status,
                hostState: row.host_state ?? undefined,
            });

            targetsByJob.set(
                row.job_id,
                existing
            );
        }

        const portsByJob = new Map<string, number>();

        for (const row of portResult.rows) {
            portsByJob.set(
                row.job_id,
                row.port_count
            );
        }

        const findingsByJob = new Map<string, number>();

        for (const row of findingResult.rows) {
            findingsByJob.set(
                row.job_id,
                row.finding_count
            );
        }

        return jobsResult.rows.map(row => ({
            id: row.id,
            status: row.status,

            totalTargets: row.total_targets,
            completedTargets: row.completed_targets,
            failedTargets: row.failed_targets,

            createdAt: new Date(row.created_at),

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
}