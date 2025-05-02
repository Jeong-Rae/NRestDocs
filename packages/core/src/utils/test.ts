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

    /**
     * Performs assertion on the error.
     * Supports asynchronous assertions as well.
     */
    catch: (assertErr: (error: unknown) => Awaitable<void>) => Promise<void>;
};

export function given<const T>(initial: Awaitable<T>): Stream<Awaited<T>> {
    const current = Promise.resolve(initial);

    const stream: Stream<unknown> = {
        when(fn) {
            const next = current.then(fn);
            return given(next) as Stream<Awaited<ReturnType<typeof fn>>>;
        },

        async then(assertFn) {
            const value = await current;
            await assertFn(value);
        },

        async catch(assertErr) {
            try {
                await current;
                throw new Error("Expected error, but none was thrown.");
            } catch (e) {
                await assertErr(e);
            }
        },
    };

    return stream as Stream<Awaited<T>>;
}
