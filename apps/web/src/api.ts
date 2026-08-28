const API_URL =
    import.meta.env.VITE_API_URL ??
    "http://127.0.0.1:3001";

export interface ScanHistoryTarget {
    host: string;
    status: ScanTargetStatus;
    hostState?: string;
}

export interface ScanHistorySummary {
    id: string;
    status: ScanStatus;
    totalTargets: number;
    completedTargets: number;
    failedTargets: number;
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    targets: ScanHistoryTarget[];
    portCount: number;
    findingCount: number;
}

export async function getScanHistory(): Promise<
    ScanHistorySummary[]
> {
    const response = await fetch(
        `${API_URL}/scan`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch scan history: ${response.status}`
        );
    }

    return response.json();
}

export type ScanStatus =
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

export type PortState =
    | "open"
    | "closed"
    | "filtered"
    | "open|filtered"
    | "closed|filtered"
    | "unknown";

export interface ScanPort {
    port: number;

    protocol: "tcp" | "udp";

    state: PortState;

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

export interface FindingWithScan
    extends SecurityFinding {
    scanId: string;
    host: string;
    createdAt: string;
}

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

export interface SecurityFinding {
    id: string;

    severity:
        | "info"
        | "low"
        | "medium"
        | "high"
        | "critical";

    title: string;

    description: string;

    evidence: string[];

    port?: number;

    service?: string;

    confidence: number;
}

export interface InspectionResult {
    port: number;

    service: string;

    reachable: boolean;

    authenticated?: boolean;

    protocol?: string;

    banner?: string;

    metadata?: Record<string, unknown>;

    evidence: string[];
}

export interface ScanAnalysis {
    host: string;
    hostname?: string;
    scanStatus: ScanCompletionStatus;

    infrastructure: {
        type: string;
        originVisibility: string;
        vendor?: string;
        technologies: string[];
        confidence: number;
        evidence: string[];
        ports: number[];
    };

    ports: unknown[];

    summary: {
        totalPorts: number;
        openPorts: number;
        services: string[];
        technologies: string[];

        risk: {
            critical: number;
            high: number;
            medium: number;
            low: number;
            info: number;
        };

        webServices: number;
        databaseServices: number;
    };

    risk: unknown;

    findings: SecurityFinding[];

    meta: {
        startedAt: string;
        completedAt: string;
        durationMs: number;
        portsScanned: number;
        inspectionsCompleted: number;
    };
}

export interface ScanJob {
    id: string;

    status: ScanStatus;

    totalTargets: number;

    completedTargets: number;

    failedTargets: number;

    createdAt: string;

    startedAt?: string;

    completedAt?: string;

    error?: string;

    targets?: ScanTarget[];
}

export interface ScanTarget {
    id: string;
    jobId: string;
    host: string;
    status: ScanTargetStatus;
    hostState?: string;

    result?: ScanResult;
    inspections?: InspectionResult[];
    analysis?: ScanAnalysis;

    error?: string;

    createdAt: string;
    startedAt?: string;
    completedAt?: string;
}

async function parseError(
    response: Response,
    fallback: string
): Promise<never> {
    let message = fallback;

    try {
        const data = await response.json();

        if (data?.message) {
            message = data.message;
        }
    } catch {

    }

    throw new Error(message);
}

export async function createScan(
    targets: string[]
): Promise<ScanJob> {
    const response = await fetch(
        `${API_URL}/scan`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                targets,
            }),
        }
    );

    if (!response.ok) {
        return parseError(
            response,
            `Scan request failed (${response.status})`
        );
    }

    return response.json();
}

export async function getScan(
    jobId: string
): Promise<ScanJob> {

    const response = await fetch(
        `${API_URL}/scan/${jobId}`
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(
                "Scan not found"
            );
        }

        throw new Error(
            `Failed to fetch scan: ${response.status}`
        );
    }

    return response.json();
}

export async function getScans(): Promise<ScanJob[]> {
    const response = await fetch(
        `${API_URL}/scan`
    );

    if (!response.ok) {
        return parseError(
            response,
            `Failed to fetch scan history (${response.status})`
        );
    }

    return response.json();
}