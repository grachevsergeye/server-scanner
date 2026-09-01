import type { ScanPort } from "../types/scan.types.js";
import type { InspectionResult } from "./inspector-result.types.js";

export interface Inspector {
    supports(port: ScanPort): boolean;

    inspect(
        host: string,
        port: ScanPort
    ): Promise<InspectionResult>;
}