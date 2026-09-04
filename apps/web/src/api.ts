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
    durationMs?: number;
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
    targetId: string;
    host: string;
    createdAt: string;

    scanStartedAt?: string;
    scanCompletedAt?: string;
    scanStatus?: ScanStatus;
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

export interface FindingEvidence {
    key: string;
    params?: Record<string, string | number>;
}

export interface AnalyticsOverview {
    registrations: number;
    link_clicks: number;
    click_events: number;
}

export interface AnalyticsClick {
    id: number;
    source_name: string;
    ip_address?: string;
    created_at: string;
}

export interface AnalyticsRegistration {
    id: number;
    email: string;
    traffic_source?: string;
    registration_ip?: string;
    created_at: string;
}

export interface SecurityFinding {
    id: string;

    severity:
        | "info"
        | "low"
        | "medium"
        | "high"
        | "critical";

    titleKey: string;
    descriptionKey: string;

    evidence: FindingEvidence[];

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

    durationMs?: number | null;

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

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const response = await fetch(
        `${API_URL}/analytics/overview`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch analytics overview (${response.status})`
        );
    }

    return response.json();
}

export interface AnalyticsClickEvent {
  id: number;
  source_name: string;
  ip_address?: string;
  target_url?: string;
  created_at: string;
  traffic_source?: string;
}

export async function getAnalyticsRegistrations(): Promise<
    AnalyticsRegistration[]
> {
    const response = await fetch(
        `${API_URL}/analytics/registrations`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch analytics registrations (${response.status})`
        );
    }

    return response.json();
}

async function downloadAnalyticsCsv(
    path: string,
    filename: string,
): Promise<void> {
    const response = await fetch(
        `${API_URL}${path}`,
    );

    if (!response.ok) {
        throw new Error(
            `CSV export failed (${response.status})`,
        );
    }

    const blob = await response.blob();

    const url =
        URL.createObjectURL(blob);

    const anchor =
        document.createElement("a");

    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}

export function exportAnalyticsClicksCsv() {
    return downloadAnalyticsCsv(
        "/analytics/clicks/export",
        "link-clicks.csv",
    );
}

export function exportAnalyticsClickEventsCsv() {
    return downloadAnalyticsCsv(
        "/analytics/click-events/export",
        "click-events.csv",
    );
}

export function exportAnalyticsRegistrationsCsv() {
    return downloadAnalyticsCsv(
        "/analytics/registrations/export",
        "registrations.csv",
    );
}

export interface AnalyticsDeleteResult {
    success: boolean;
    deleted: number;
}

export async function deleteAnalyticsRegistration(
    filter:
        | { email: string }
        | { source: string }
        | { ip: string },
): Promise<AnalyticsDeleteResult> {
    const params =
        new URLSearchParams(filter);

    const response = await fetch(
        `${API_URL}/analytics/admin/registrations?${params}`,
        {
            method: "DELETE",
        },
    );

    if (!response.ok) {
        return parseError(
            response,
            "Failed to delete registrations",
        );
    }

    return response.json();
}

export async function truncateAnalyticsRegistrations(): Promise<void> {
    const response = await fetch(
        `${API_URL}/analytics/admin/registrations/truncate`,
        {
            method: "POST",
        },
    );

    if (!response.ok) {
        return parseError(
            response,
            "Failed to clear registrations",
        );
    }
}

export type AnalyticsDataset =
    | "link_clicks"
    | "click_events";

export type DeleteMode =
    | "filtered"
    | "last"
    | "range";

export interface AnalyticsFilters {
    dataset: AnalyticsDataset;

    source?: string;
    trafficSource?: string;
    ip?: string;
    targetUrl?: string;
    from?: string;
    to?: string;

    limit?: number;
    offset?: number;
}

export interface AnalyticsQueryResult<T> {
    dataset: AnalyticsDataset;
    total: number;
    rows: T[];
}

function buildAnalyticsParams(
    filters: AnalyticsFilters,
) {
    const params =
        new URLSearchParams();

    params.set(
        "dataset",
        filters.dataset,
    );

    if (filters.source) {
        params.set(
            "source",
            filters.source,
        );
    }

    if (
        filters.trafficSource
    ) {
        params.set(
            "trafficSource",
            filters.trafficSource,
        );
    }

    if (filters.ip) {
        params.set(
            "ip",
            filters.ip,
        );
    }

    if (filters.targetUrl) {
        params.set(
            "targetUrl",
            filters.targetUrl,
        );
    }

    if (filters.from) {
        params.set(
            "from",
            filters.from,
        );
    }

    if (filters.to) {
        params.set(
            "to",
            filters.to,
        );
    }

    if (filters.limit) {
        params.set(
            "limit",
            String(filters.limit),
        );
    }

    if (
        filters.offset !==
        undefined
    ) {
        params.set(
            "offset",
            String(filters.offset),
        );
    }

    return params;
}

export async function getAnalytics<T>(
    filters: AnalyticsFilters,
): Promise<AnalyticsQueryResult<T>> {
    const params =
        buildAnalyticsParams(filters);

    const response =
        await fetch(
            `${API_URL}/analytics?${params}`,
        );

    if (!response.ok) {
        throw new Error(
            `Analytics request failed (${response.status})`,
        );
    }

    return response.json();
}

export async function previewAnalyticsDelete(
    filters: AnalyticsFilters,
    mode: DeleteMode,
    count?: number,
): Promise<{ count: number }> {
    const params =
        buildAnalyticsParams(filters);

    params.set(
        "mode",
        mode,
    );

    if (
        mode === "last" &&
        count !== undefined
    ) {
        params.set(
            "count",
            String(count),
        );
    }

    const response =
        await fetch(
            `${API_URL}/analytics/delete-preview?${params}`,
        );

    if (!response.ok) {
        return parseError(
            response,
            "Failed to preview deletion",
        );
    }

    return response.json();
}

export async function deleteAnalytics(
    body: {
        dataset: AnalyticsDataset;
        mode: DeleteMode;
        filters?: AnalyticsFilters;
        count?: number;
    },
): Promise<AnalyticsDeleteResult> {
    const response =
        await fetch(
            `${API_URL}/analytics`,
            {
                method: "DELETE",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify(body),
            },
        );

    if (!response.ok) {
        return parseError(
            response,
            "Delete failed",
        );
    }

    return response.json();
}

export async function exportAnalyticsCsv(
    filters: AnalyticsFilters,
) {
    const params =
        buildAnalyticsParams(filters);

    const response =
        await fetch(
            `${API_URL}/analytics/export?${params}`,
        );

    if (!response.ok) {
        throw new Error(
            `Export failed (${response.status})`,
        );
    }

    const blob =
        await response.blob();

    const url =
        URL.createObjectURL(blob);

    const anchor =
        document.createElement("a");

    anchor.href = url;

    anchor.download =
        `${filters.dataset}.csv`;

    document.body.appendChild(
        anchor,
    );

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);
}