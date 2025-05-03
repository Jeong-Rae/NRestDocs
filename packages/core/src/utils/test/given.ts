type Awaitable<T> = T | Promise<T>;

/**
 * Stream type representing the subsequent chain
 * - when(): Value transformation
 * - then(): Assertion
 */
type Stream<T> = {
    /**
     * Applies transformation logic.
     * Can be called multiple times, and the result of each call is passed to the next when.
     */
    when: <U>(fn: (value: T) => Awaitable<U>) => Stream<Awaited<U>>;

    /**
     * Inspects the value.
     * Can be called multiple times, and the result of each call is passed to the next when.
     */
    inspect: (fn: (value: T) => void) => Stream<T>;

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

/**
 * Multi‑input stream for handling an array of values in a single test case.
 */
type MultiStream<T> = {
    /**
     * Applies transformation logic to every input value.
     */
    when: <U>(fn: (value: T) => Awaitable<U>) => MultiStream<Awaited<U>>;

    /**
     * Reads each intermediate value without modifying it.
     * The second parameter is the index of the value in the original array.
     */
    inspect: (fn: (value: T, index: number) => void) => MultiStream<T>;

    /**
     * Performs assertion on **all** results at once.
     */
    then: (assertFn: (results: T[]) => Awaitable<void>) => Promise<void>;

    /**
     * Performs assertion on **all** errors at once.
     */
    catch: (assertErr: (errors: unknown[]) => Awaitable<void>) => Promise<void>;
};

function givenFn<const T>(initial: Awaitable<T>): Stream<Awaited<T>> {
    const current = Promise.resolve(initial);

    const stream: Stream<unknown> = {
        when(fn) {
            const next = current.then(fn);
            return givenFn(next) as Stream<Awaited<ReturnType<typeof fn>>>;
        },

        inspect(fn: (value: T) => void): Stream<T> {
            return givenFn(
                current.then((v) => {
                    fn(v);
                    return v;
                })
            );
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

/**
 * Creates a multi‑input stream so that several inputs can be tested
 * with a single `it` / single `then` (or `catch`).
 */
export function givenEach<const T>(inputs: readonly Awaitable<T>[]): MultiStream<Awaited<T>> {
    const promises = inputs.map((v) => Promise.resolve(v));

    const multi: MultiStream<unknown> = {
        when<U>(fn: (value: T) => Awaitable<U>) {
            const next = promises.map((p) => p.then(fn));
            return givenEach(next) as MultiStream<Awaited<U>>;
        },

        inspect(fn) {
            promises.forEach((p, i) => void p.then((v) => fn(v as T, i)));
            return multi as MultiStream<T>;
        },

        async then(assertFn) {
            const results = (await Promise.all(promises)) as Awaited<T>[];
            await assertFn(results);
        },

        async catch(assertErr) {
            const errors: unknown[] = [];
            for (const p of promises) {
                try {
                    await p;
                    errors.push(new Error("Expected error, but none was thrown."));
                } catch (e) {
                    errors.push(e);
                }
            }
            await assertErr(errors);
        },
    };

    return multi as MultiStream<Awaited<T>>;
}

/**
 * The `given` function is a namespace for the `givenFn` and `givenEach` functions.
 * It is used to create a stream of values that can be used to test a function.
 *
 * @example
 *
 * ```ts
 * given("hello").when((s) => s.toUpperCase()).then((s) => {
 *     expect(s).toEqual("HELLO");
 * });
 * ```
 *
 * @example
 *
 * ```ts
 * given.each([1, 2, 3]).when((x) => x * 2).then((results) => {
 *     expect(results).toEqual([2, 4, 6]);
 * });
 * ```
 */
export const given = Object.assign(givenFn, {
    each: givenEach,
});
