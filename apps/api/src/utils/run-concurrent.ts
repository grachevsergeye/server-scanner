export async function runConcurrent<T>(
    items: T[],
    concurrency: number,
    worker: (item: T) => Promise<void>
): Promise<void> {

    if (items.length === 0) {
        return;
    }

    const limit = Math.max(
        1,
        Math.floor(concurrency)
    );

    let index = 0;

    async function runner(): Promise<void> {

        while (true) {

            const currentIndex = index++;

            if (currentIndex >= items.length) {
                return;
            }

            await worker(
                items[currentIndex]
            );
        }
    }

    const workers = Array.from(
        {
            length: Math.min(
                limit,
                items.length
            )
        },
        () => runner()
    );

    await Promise.all(workers);
}