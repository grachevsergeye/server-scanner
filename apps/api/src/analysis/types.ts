import type { ScanPort } from "../types/scan.types.js";
import type { PortInspections } from "../inspection/types.js";
import type { ServiceFingerprint } from "../fingerprint/fingerprint.types.js";
import type { RiskResult, HostRiskResult } from "../risk/types.js";

import type {
    InfrastructureAnalysis
} from "../infrastructure/infrastructure.types.js";

import type {
    HostInfrastructureAnalysis
} from "../infrastructure/host-infrastructure.types.js";


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

    infrastructure:
        HostInfrastructureAnalysis;

    ports:
        PortAnalysis[];

    summary:
        ScanSummary;

    risk:
        HostRiskResult;
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