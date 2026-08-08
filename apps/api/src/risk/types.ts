export type RiskLevel =
    | "Critical"
    | "High"
    | "Medium"
    | "Low"
    | "Info";

export interface RiskResult {
    level: RiskLevel;
    reason: string;
    code: string;
}