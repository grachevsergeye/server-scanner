import type {
    ScanResult,
    ScanTarget,
    ScanTargetStatus,
} from "../../types/scan.types.js";

export interface CreateScanTargetData {
    jobId: string;
    host: string;
    status: ScanTargetStatus;
}

export interface UpdateScanTargetData {
    status?: ScanTargetStatus;

    result?: ScanResult;

    error?: string;

    startedAt?: Date;

    completedAt?: Date;
}

export interface ScanTargetRepository {

    createMany(
        targets: CreateScanTargetData[]
    ): Promise<ScanTarget[]>;

    findById(
        id: string
    ): Promise<ScanTarget | null>;

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
        id: string,
        result: ScanResult
    ): Promise<ScanTarget>;

    markFailed(
        id: string,
        error: string
    ): Promise<ScanTarget>;
}