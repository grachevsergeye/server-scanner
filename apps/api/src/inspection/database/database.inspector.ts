import type { Inspector } from "../../inspectors/inspector.interface.js";
import type { ScanPort } from "../../types/scan.types.js";
import type { InspectionResult } from "../../inspectors/inspector.interface.js";

export abstract class DatabaseInspector
    implements Inspector {

    abstract supports(
        port: ScanPort
    ): boolean;

    abstract inspect(
        host: string,
        port: ScanPort
    ): Promise<InspectionResult>;
}