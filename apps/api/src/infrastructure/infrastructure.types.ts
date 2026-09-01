export type InfrastructureType =
    | "direct"
    | "cdn"
    | "reverse-proxy"
    | "load-balancer"
    | "waf"
    | "unknown";

export type OriginVisibility =
    | "visible"
    | "hidden"
    | "unknown";

export interface InfrastructureAnalysis {
    type: InfrastructureType;
    originVisibility: OriginVisibility;

    vendor?: string;

    technologies: string[];

    confidence: number;

    evidence: string[];
}