type Awaitable<T> = T | Promise<T>;

/**
 * 이후 체인을 표현할 스트림 타입
 * - when() : 값 변환
 * - then() : 검증(Assertion)
 */
export type Stream<T> = {
    /**
     * 변환 로직을 적용합니다.
     * 여러 번 호출할 수 있으며, 각각의 호출 결과가 다음 when 으로 전달됩니다.
     */
    when: <U>(fn: (value: T) => Awaitable<U>) => Stream<Awaited<U>>;

    /**
     * 최종 결과에 대해 검증(Assertion)을 수행합니다.
     * 비동기 Assertion 도 지원합니다.
     */
    then: (assertFn: (value: T) => Awaitable<void>) => Promise<void>;
};

export function given<const T>(initial: Awaitable<T>): Stream<Awaited<T>> {
    // 내부 상태는 항상 Promise 로 래핑하여 동‧비동기를 통일
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
