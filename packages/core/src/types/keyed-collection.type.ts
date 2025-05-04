/**
 * Represents an item in an array with all fields of `V` plus a specific key field `K` of type string.
 *
 * Useful for creating arrays of objects that require a consistent identifier key.
 *
 * @template K - The key field name to be added (must be a string literal).
 * @template V - The base type of the object.
 *
 * @example
 * type User = { name: string };
 * type UserWithId = ArrayItem<'id', User>;
 *
 * const user: UserWithId = {
 *   id: 'user_1',
 *   name: 'Alice',
 * };
 */
export type ArrayItem<K extends string, V> = V & { [P in K]: string };

/**
 * A collection of items keyed by a specific field, represented as either an array or a record.
 *
 * Allows you to handle both array-based and object-based collections uniformly,
 * where array items include a string key field, and records use the key as the object key.
 *
 * @template K - The name of the key field (must be a string literal).
 * @template V - The base type of the item.
 *
 * @example
 * type User = { name: string };
 * type UserCollection = KeyedCollection<'id', User>;
 *
 * const usersArray: UserCollection = [
 *   { id: 'a1', name: 'Alice' },
 *   { id: 'b2', name: 'Bob' },
 * ];
 *
 * const usersRecord: UserCollection = {
 *   a1: { name: 'Alice' },
 *   b2: { name: 'Bob' },
 * };
 */
export type KeyedCollection<K extends string, V> = ArrayItem<K, V>[] | Record<string, V>;
