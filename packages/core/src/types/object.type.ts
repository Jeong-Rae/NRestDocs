/**
 * Represents a plain object with any property key and unknown values.
 *
 * Useful for cases where the object shape is not strictly defined, allowing any keys and values.
 *
 * @example
 * const obj: PlainObject = {
 *   id: 1,
 *   name: 'Alice',
 *   extra: true,
 * };
 *
 * const another: PlainObject = Object.create(null); // also valid
 */
export type PlainObject = Record<PropertyKey, unknown>;
