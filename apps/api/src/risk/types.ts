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

export interface HostRiskResult {
    level: RiskLevel;
    score: number;

    totalPorts: number;

    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
}