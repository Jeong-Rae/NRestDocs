import { get, isFunction, isObjectLike } from "es-toolkit/compat";

export function isBuilder<T extends object>(obj: unknown): obj is T {
    return isObjectLike(obj) && "build" in obj && isFunction(get(obj, "build"));
}
