export interface ConcurrencyConfig {
    maxConcurrentScans: number;
}

export const scannerConcurrency = {

    maxConcurrentScans: 4,

    maxConcurrentInspectors: 8,

};