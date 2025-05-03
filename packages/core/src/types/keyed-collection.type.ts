/**
 * Array element type
 * - All fields of V + specified key field (string type)
 */
export type ArrayItem<K extends string, V> = V & { [P in K]: string };

/**
 * KeyedCollection
 * - Collection in the form of an array or record with a specific key field
 */
export type KeyedCollection<K extends string, V> = ArrayItem<K, V>[] | Record<string, V>;
