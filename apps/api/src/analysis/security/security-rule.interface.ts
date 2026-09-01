import type {
    AnalysisContext,
    SecurityFinding
} from "../types.js";

export interface SecurityRule {
    id: string;
    name: string;

    evaluate(
        context: AnalysisContext
    ): SecurityFinding[];
}