export interface ScanPort {
    port: number;
    protocol: string;

    state: string;

    service: string;
    product: string;
    version: string;

    extraInfo: string;
    tunnel: string;

    nmapConfidence: number;
}

export interface ScanResult {
    host: string;
    hostname?: string;
    ports: ScanPort[];
}