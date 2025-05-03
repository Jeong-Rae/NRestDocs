import type { ArrayItem } from "./keyed-collection.type";

/**
 * Check if the given value is in Array format of KeyedCollection.
 * @param key - Key field name
 * @param value - Value to check
 * @returns true if the value is of type `ArrayItem<K, V>[]`
 *
 * @example
 * isKeyedArray('id', { id: 'u1', name: 'Alice' }); // true
 * isKeyedArray('id', [{ name: 'Alice' }]); // false
 */
export function isKeyedArray<K extends string, V>(
    key: K,
    value: unknown
): value is ArrayItem<K, V>[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                // biome-ignore lint/suspicious/noExplicitAny: use for type guard
                typeof item === "object" && item !== null && typeof (item as any)[key] === "string"
        )
    );
}

/**
 * Check if the given value is in Record format of KeyedCollection
 *
 * @param value - Value to check
 * @returns true if the value is of type `Record<string, V>`
 * @example
 * isKeyedRecord('id', { u1: { id: 'u1', name: 'Alice' } }); // true
 */
export function isKeyedRecord<K extends string, V>(
    key: K,
    value: unknown
): value is Record<string, V & { [P in K]: string }> {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.values(value).every((item) => typeof item === "object" && item !== null)
    );
}
