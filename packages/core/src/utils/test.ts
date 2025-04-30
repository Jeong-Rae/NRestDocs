type Awaitable<T> = T | Promise<T>;

/**
 * Stream type representing the subsequent chain
 * - when(): Value transformation
 * - then(): Assertion
 */
export type Stream<T> = {
    /**
     * Applies transformation logic.
     * Can be called multiple times, and the result of each call is passed to the next when.
     */
    when: <U>(fn: (value: T) => Awaitable<U>) => Stream<Awaited<U>>;

    /**
     * Performs assertion on the final result.
     * Supports asynchronous assertions as well.
     */
    then: (assertFn: (value: T) => Awaitable<void>) => Promise<void>;
};

export function given<const T>(initial: Awaitable<T>): Stream<Awaited<T>> {
    const current = Promise.resolve(initial);

    const stream: Stream<unknown> = {
        when<U>(fn: (value: unknown) => Awaitable<U>) {
            return given(current.then(fn)) as Stream<Awaited<U>>;
        },
        async then(assertFn) {
            await assertFn(await current);
        },
    };

    return stream as Stream<Awaited<T>>;
}
