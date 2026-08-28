export interface FindingRepository {
    findByJobId(
        jobId: string
    ): Promise<Finding[]>;
}

export interface Finding {
    id: string;
    jobId: string;
    targetId: string;
    host: string;
    port?: number;
    service?: string;
    severity: string;
    title: string;
    description: string;
    evidence: string[];
    confidence: number;
    createdAt: Date;
}