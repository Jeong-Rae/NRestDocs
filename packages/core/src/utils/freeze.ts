import type { PlainObject } from "@/types/object.type";

export function freeze<T>(obj: T): Readonly<T> {
    return Object.freeze(obj);
}

export function deepFreeze<T>(obj: T): Readonly<T> {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((key) => {
        const value = (obj as PlainObject)[key];
        if (value && typeof value === "object" && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });
    return obj;
}
