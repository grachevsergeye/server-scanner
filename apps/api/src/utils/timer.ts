export function nowMs(): number {
    return performance.now();
}

export function elapsedMs(
    start: number
): number {
    return Math.round(
        performance.now() - start
    );
}