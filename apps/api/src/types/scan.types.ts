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

    serviceMethod?: string;

    cpe?: string[];

    nmapConfidence?: number;

    serviceFingerprint?: string;
}

export type ScanCompletionStatus =
    | "completed"
    | "partial"
    | "timeout"
    | "failed";

export interface ScanResult {

    host: string;

    state:
        | "up"
        | "down"
        | "unknown";

    hostname?: string;

    scanStatus: ScanCompletionStatus;

    addresses?: {
        ipv4?: string;
        ipv6?: string;
        mac?: string;
    };

    ports: ScanPort[];

    filteredPorts?: {
        count: number;
        reason?: string;
        ports?: string;
    };

    scan?: {
        startedAt?: string;
        completedAt?: string;
        durationMs?: number;
        nmapVersion?: string;
        arguments?: string;
    };

    error?: {
        code: string;
        message: string;
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

export interface DiscoveredHost {
    ip: string;
    hostnames: string[];
}