export interface ServiceFingerprint {
    port: number;

    service: string;

    product?: string;
    version?: string;

    confidence: number;

    vendor: string;
    category: string;

    technologies: string[];

    evidence: string[];
}