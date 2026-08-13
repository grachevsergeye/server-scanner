export interface ConcurrencyConfig {
    maxConcurrentScans: number;
}

export const scannerConcurrency: ConcurrencyConfig = {
    maxConcurrentScans: 4,
};