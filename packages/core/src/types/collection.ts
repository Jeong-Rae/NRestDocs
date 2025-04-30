/**
 * Array element type
 * - All fields of V + specified key field (string type)
 */
type ArrayItem<K extends string, V> = V & { [P in K]: string };

/**
 * KeyedCollection
 * - Collection in the form of an array or record with a specific key field
 */
export type KeyedCollection<K extends string, V> = ArrayItem<K, V>[] | Record<string, V>;

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
 * isKeyedRecord( { u1: { id: 'u1', name: 'Alice' } }); // true
 */
export function isKeyedRecord<K extends string, V>(
    key: K,
    value: unknown
): value is Record<string, V & { [P in K]: string }> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }

    return Object.values(value as Record<string, unknown>).every(
        (item) =>
            // biome-ignore lint/suspicious/noExplicitAny: use for type guard
            typeof item === "object" && item !== null && typeof (item as any)[key] === "string"
    );
}

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
 * keyedArrayToRecord('id', [{ id: 'u1', name: 'Alice' }]); // { u1: { name: 'Alice' } }
 */
export function keyedArrayToRecord<K extends string, V extends Record<string, unknown>>(
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
