export class TimeoutError
    extends Error {

    readonly code = "ETIMEDOUT";

    constructor(
        message: string,
        public readonly timeoutMs: number,
    ) {
        super(message);

        this.name =
            "TimeoutError";
    }
}

export async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    message = `Operation timed out after ${timeoutMs}ms`,
): Promise<T> {

    let timer:
        NodeJS.Timeout;

    const timeout =
        new Promise<never>(
            (_, reject) => {

                timer =
                    setTimeout(() => {

                        reject(
                            new TimeoutError(
                                message,
                                timeoutMs,
                            )
                        );

                    }, timeoutMs);
            }
        );

    try {

        return await Promise.race([
            promise,
            timeout,
        ]);

    } finally {

        clearTimeout(timer!);
    }
}