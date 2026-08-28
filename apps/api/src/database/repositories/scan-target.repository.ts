import type {
    ScanResult,
    ScanTarget,
    ScanTargetStatus,
} from "../../types/scan.types.js";

import type {
    InspectionResult,
} from "../../inspectors/inspector-result.types.js";

import type {
    ScanAnalysis,
} from "../../analysis/types.js";

export interface CreateScanTargetData {
    jobId: string;
    host: string;
    status: ScanTargetStatus;
}

export interface UpdateScanTargetData {

    status?: ScanTargetStatus;

    result?: ScanResult;

    inspections?: InspectionResult[];

    analysis?: ScanAnalysis;

    error?: string;

    startedAt?: Date;

    completedAt?: Date;
}

export interface CompleteScanTargetData {
    targetId: string;
    scan: ScanResult;
    inspections: InspectionResult[];
    analysis: ScanAnalysis;
}

export interface ScanTargetRepository {
    createMany(
        targets: CreateScanTargetData[]
    ): Promise<ScanTarget[]>;

    findById(
        targetId: string
    ): Promise<ScanTarget | null>;

    findByJobId(
        jobId: string
    ): Promise<ScanTarget[]>;

    update(
        id: string,
        data: UpdateScanTargetData
    ): Promise<ScanTarget>;

    markScanning(
        id: string
    ): Promise<ScanTarget>;

    markInspecting(
        id: string
    ): Promise<ScanTarget>;

    markFingerprinting(
        id: string
    ): Promise<ScanTarget>;

    markRisk(
        id: string
    ): Promise<ScanTarget>;

    markCompleted(
        data: CompleteScanTargetData
    ): Promise<ScanTarget>;

    markFailed(
        id: string,
        error: string
    ): Promise<ScanTarget>;
}