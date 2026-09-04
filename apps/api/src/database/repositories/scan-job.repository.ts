import type {
    ScanJob,
    ScanJobStatus,
} from "../../types/scan.types.js";

export interface CreateScanJobData {
    status: ScanJobStatus;

    totalTargets: number;

    completedTargets: number;

    failedTargets: number;
}

export interface UpdateScanJobData {
    status?: ScanJobStatus;

    completedTargets?: number;

    failedTargets?: number;

    startedAt?: Date;

    completedAt?: Date;

    error?: string;
}

export interface ScanHistorySummary {
    id: string;
    status: string;
    totalTargets: number;
    completedTargets: number;
    failedTargets: number;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    durationMs?: number;
    targets: {
        host: string;
        status: string;
        hostState?: string;
    }[];
    portCount: number;
    findingCount: number;
}

export interface ScanJobRepository {
    create(
        data: CreateScanJobData
    ): Promise<ScanJob>;

    findById(
        id: string
    ): Promise<ScanJob | null>;

    findRecent(
        limit: number
    ): Promise<ScanHistorySummary[]>;

    update(
        id: string,
        data: UpdateScanJobData
    ): Promise<ScanJob>;

    incrementProgress(
        id: string,
        success: boolean
    ): Promise<ScanJob>;
}