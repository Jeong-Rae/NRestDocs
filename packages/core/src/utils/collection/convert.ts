import type { ArrayItem } from "./keyed-collection.type";

/**
 * Convert given record to an array of key-value pairs
 * @param key - Key field name
 * @param record - Record to convert
 * @returns Array of key-value pairs
 *
 * @example
 * keyedRecordToArray('id', { u1: { id: 'u1', name: 'Alice' } }); // [{ id: 'u1', name: 'Alice' }]
 */
export function keyedRecordToArray<K extends string, V>(
    key: K,
    record: Record<string, V>
): ArrayItem<K, V>[] {
    return Object.entries(record).map(([k, value]) => ({
        ...value,
        [key]: k,
    })) as ArrayItem<K, V>[];
}

/**
 * Convert given array to a record of key-value pairs
 * @param key - Key field name
 * @param array - Array to convert
 * @returns Record of key-value pairs
 *
 * @example
 * keyedArrayToRecord('id', [{ id: 'u1', name: 'Alice' }]); // { u1: { id: 'u1', name: 'Alice' } }
 */

export function keyedArrayToRecord<K extends string, V>(
    key: K,
    array: ArrayItem<K, V>[]
): Record<string, ArrayItem<K, V>> {
    const record: Record<string, ArrayItem<K, V>> = {};
    for (const item of array) {
        const k = item[key];
        record[k] = item;
    }
    return record;
}

/**
 * Convert given array to a record of key-value pairs
 * @param key - Key field name
 * @param array - Array to convert
 * @returns Record of key-value pairs
 * @example
 * keyedArrayToRecordWithoutKey('id', [{ id: 'u1', name: 'Alice' }]); // { u1: { name: 'Alice' } }
 */
export function keyedArrayToRecordWithoutKey<K extends string, V extends Record<string, unknown>>(
    key: K,
    array: ArrayItem<K, V>[]
): Record<string, V> {
    const record: Record<string, V> = {};
    for (const item of array) {
        const k = item[key];
        const { [key]: _, ...rest } = item;
        record[k] = rest as V;
    }
    return record;
}
