import type { RiskCode } from "./definitions.js";

export type RiskLevel =
    | "Critical"
    | "High"
    | "Medium"
    | "Low"
    | "Info";


export interface RiskResult {

    level:
        RiskLevel;

    code:
        RiskCode;

    reason:
        string;

    confidence:
        number;
}


export interface RiskFinding {

    level:
        RiskLevel;

    code:
        RiskCode;

    title:
        string;

    reason:
        string;

    confidence:
        number;

    ports?:
        number[];

    count?:
        number;
}


export interface HostRiskResult {

    level:
        RiskLevel;

    score:
        number;

    findings:
        RiskFinding[];

    totalPorts:
        number;

    critical:
        number;

    high:
        number;

    medium:
        number;

    low:
        number;

    info:
        number;
}