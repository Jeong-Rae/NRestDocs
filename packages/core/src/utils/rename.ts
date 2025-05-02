import type { PlainObject } from "@/types/object.type";
import { isArray, isPlainObject, mapKeys, mapValues } from "es-toolkit/compat";

type KeyMap = Record<PropertyKey, PropertyKey>;

/**
 * Rename the key of the object
 * @param source - The object to rename the key of
 * @param keyMap - The key map to rename the key of
 * @returns The renamed object
 * @example
 * renameKey({ a: 1, b: 2 }, { a: "c" }); // { c: 1, b: 2 }
 */
export function renameKey<K extends PlainObject>(source: K, keyMap: KeyMap): PlainObject;

/**
 * Rename the key of the object
 * @param source - The object array to rename the key of
 * @param keyMap - The key map to rename the key of
 * @returns The renamed object array
 * @example
 * renameKey([{ a: 1, b: 2 }, { a: 3, b: 4 }], { a: "c" }); // [{ c: 1, b: 2 }, { c: 3, b: 4 }]
 */
export function renameKey<K extends PlainObject>(source: K[], keyMap: KeyMap): PlainObject[];

export function renameKey<K extends PlainObject>(
    source: K | K[],
    keyMap: KeyMap
): PlainObject | PlainObject[] {
    const renameOne = (item: K): PlainObject => {
        if (!isPlainObject(item)) {
            return item;
        }
        return mapKeys(item, (_, key) => keyMap[key] || key);
    };

    return isArray(source) ? source.map(renameOne) : renameOne(source);
}

/**
 * Deep rename the key of the object
 * @param source - The object to rename the key of
 * @param keyMap - The key map to rename the key of
 * @returns The renamed object
 * @example
 * deepRenameKey({ a: 1, b: { a: 2, c: 3 } }, { a: "A" }); // { A: 1, b: { A: 2, c: 3 } }
 */
export function deepRenameKey<K extends PlainObject>(source: K, keyMap: KeyMap): PlainObject;

/**
 * Deep rename the key of the object array
 * @param source - The object array to rename the key of
 * @param keyMap - The key map to rename the key of
 * @returns The renamed object array
 * @example
 * deepRenameKey([{ a: 1, b: 2 }, { a: 3, b: 4 }], { a: "c" }); // [{ c: 1, b: 2 }, { c: 3, b: 4 }]
 */
export function deepRenameKey<K extends PlainObject>(source: K[], keyMap: KeyMap): PlainObject[];

export function deepRenameKey<K extends PlainObject>(
    source: K | K[],
    keyMap: KeyMap
): PlainObject | PlainObject[] {
    const renameOne = (item: K): PlainObject => {
        if (!isPlainObject(item)) {
            return item;
        }

        const renamed = mapKeys(item, (_, key) => keyMap[key] || key);

        return mapValues(renamed, (value) => {
            if (isPlainObject(value)) {
                return deepRenameKey(value, keyMap);
            }
            if (isArray(value)) {
                return value.map((v) => deepRenameKey(v, keyMap));
            }
            return value;
        });
    };

    return isArray(source) ? source.map(renameOne) : renameOne(source);
}
