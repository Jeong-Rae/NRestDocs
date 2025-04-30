/**
 * Array의 각 요소 타입
 * - V의 모든 필드 + 지정된 key 필드 (string 타입)
 */
type ArrayItem<K extends string, V> = V & { [P in K]: string };

/**
 * KeyedCollection
 * - 특정 키 필드를 가진 배열 또는 레코드 형태의 컬렉션
 */
export type KeyedCollection<K extends string, V> = ArrayItem<K, V>[] | Record<string, V>;

/**
 * 주어진 값이 KeyedCollection의 Array 포맷인지 확인.
 * @param key - 키 필드 명
 * @param value - 검사할 값
 * @returns 해당 값이 `ArrayItem<K, V>[]` 타입일 경우 true
 *
 * @example
 * isKeyedArray('id', { id: 'u1', name: 'Alice' }); // true
 * isKeyedArray('id', [{ name: 'Alice' }]); // false
 */
export function isKeyedArray<K extends string, V>(
    key: K,
    value: unknown
): value is ArrayItem<K, V>[] {
    return Array.isArray(value) && value.every((item) => typeof item[key] === "string");
}

/**
 * 주어진 값이 KeyedCollection의 Record 포맷인지 확인
 *
 * @param value - 검사할 값
 * @returns 해당 값이 `Record<string, V>` 타입일 경우 true
 * @example
 * isKeyedRecord( { u1: { id: 'u1', name: 'Alice' } }); // true
 */
export function isKeyedRecord<K extends string, V>(
    key: K,
    value: unknown
): value is Record<string, V> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
