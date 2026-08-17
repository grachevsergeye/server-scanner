export interface ScanPort {
    port: number;

    protocol: "tcp" | "udp";

    state:
        | "open"
        | "closed"
        | "filtered"
        | "open|filtered"
        | "closed|filtered"
        | "unknown";

    service: string;

    product?: string;
    version?: string;
    extraInfo?: string;

    tunnel?: string;

    method?: string;

    nmapConfidence?: number;

    serviceFingerprint?: string;
}

export interface ScanResult {

    host: string;

    hostname?: string;

    state?: "up" | "down" | "unknown";

    addresses?: {
        ipv4?: string;
        ipv6?: string;
        mac?: string;
    };

    ports: ScanPort[];

    scan?: {
        startedAt?: string;
        durationMs?: number;
        nmapVersion?: string;
        arguments?: string;
    };
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