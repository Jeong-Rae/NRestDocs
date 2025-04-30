import { get, isFunction, isObjectLike } from "es-toolkit/compat";

/** Builder type guard를 위한 최소 인터페이스 */
interface Buildable {
    // biome-ignore lint/suspicious/noExplicitAny: use for type guard
    build: (...args: any[]) => unknown;
}

/**
 * Builder 여부 판별 유틸
 */
export function isBuilder(obj: unknown): obj is Buildable {
    return isObjectLike(obj) && isFunction(get(obj, "build"));
}
