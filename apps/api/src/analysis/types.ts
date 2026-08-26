import type { PortInspections } from "../inspection/types.js";
import type { ServiceFingerprint } from "../fingerprint/fingerprint.types.js";
import type { RiskResult, HostRiskResult } from "../risk/types.js";
import type { InspectionResult } from "../inspectors/inspector-result.types.js";

import type {
    ScanCompletionStatus,
    ScanPort
} from "../types/scan.types.js";

import type {
    InfrastructureAnalysis
} from "../infrastructure/infrastructure.types.js";

import type {
    HostInfrastructureAnalysis
} from "../infrastructure/host-infrastructure.types.js";

export interface AnalysisContext {

    host: string;

    ports: ScanPort[];

    inspections: InspectionResult[];

}

export interface PortAnalysis {

    port: ScanPort;

    inspections:
        PortInspections;

    fingerprint:
        ServiceFingerprint;

    infrastructure:
        InfrastructureAnalysis;

    risk:
        RiskResult;
}

export interface ScanAnalysis {
    host: string;
    hostname?: string;

    scanStatus: ScanCompletionStatus;

    infrastructure:
        HostInfrastructureAnalysis;

    ports:
        PortAnalysis[];

    summary:
        ScanSummary;

    risk:
        HostRiskResult;

    findings:
        SecurityFinding[];

    meta: {
        startedAt: string;
        completedAt: string;
        durationMs: number;
        portsScanned: number;
        inspectionsCompleted: number;
    };
}

export interface ScanSummary {

    totalPorts: number;

    openPorts: number;

    services:
        string[];

    technologies:
        string[];

    risk: {

        critical: number;

        high: number;

        medium: number;

        low: number;

        info: number;
    };

    webServices: number;

    databaseServices: number;
}

export type FindingSeverity =
    | "info"
    | "low"
    | "medium"
    | "high"
    | "critical";

export interface SecurityFinding {
    id: string;

    severity: FindingSeverity;

    title: string;

    description: string;

    evidence: string[];

    port?: number;

    service?: string;

    confidence: number;
}

export interface ThreatInspection {

    category:
        | "phishing"
        | "malware"
        | "rat"
        | "stealer"
        | "botnet"
        | "suspicious";

    confidence: number;

    indicators: string[];

    evidence?: {

        url?: string;

        title?: string;

        hash?: string;

        server?: string;

        fingerprint?: string;
    };
}