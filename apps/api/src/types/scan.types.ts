export interface ScanPort {
    port: number;
    protocol: string;

    state: string;

    service: string;
    product: string;
    version: string;

    extraInfo: string;
    tunnel: string;

    nmapConfidence: number;
}

export interface ScanResult {
    host: string;
    hostname?: string;
    ports: ScanPort[];
}

export type ScanJobStatus =
    | "queued"
    | "running"
    | "completed"
    | "failed"
    | "cancelled";

export type ScanTargetStatus =
    | "queued"
    | "scanning"
    | "inspecting"
    | "fingerprinting"
    | "risk"
    | "completed"
    | "failed";

export interface ScanJob {
    id: string;

    status: ScanJobStatus;

    totalTargets: number;
    completedTargets: number;
    failedTargets: number;

    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;

    error?: string;
}

export interface ScanTarget {
    id: string;

    jobId: string;

    host: string;

    status: ScanTargetStatus;

    result?: ScanResult;

    inspections?: unknown;

    analysis?: unknown;

    error?: string;

    createdAt: Date;

    startedAt?: Date;

    completedAt?: Date;
}