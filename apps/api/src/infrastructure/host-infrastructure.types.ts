import type {
    InfrastructureType,
    OriginVisibility
} from "./infrastructure.types.js";

export interface HostInfrastructureAnalysis {

    type: InfrastructureType;

    originVisibility: OriginVisibility;

    vendor?: string;

    technologies: string[];

    confidence: number;

    evidence: string[];

    ports: number[];
}