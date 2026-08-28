import type { ScanPort } from "../types/scan.types.js";

export interface ServiceInspector {
    supports(port: ScanPort): boolean;

    inspect(
        target: string,
        port: ScanPort
    ): Promise<ServiceInspection>;
}

export interface ServiceInspection {
    port: number;
    service: string;

    reachable: boolean;

    authenticated?: boolean;

    protocol?: string;

    banner?: string;

    metadata?: Record<string, unknown>;

    evidence: string[];
}