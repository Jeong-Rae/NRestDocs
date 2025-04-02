import {
    isArray,
    isBoolean,
    isFunction,
    isNil,
    isNumber,
    isObjectLike,
    isString,
    isUndefined,
} from "es-toolkit/compat";

/**
 * 예상 타입(type 문자열)과 실제 값(value)이 일치하는지 검사합니다.
 *
 * @param expected 예상 타입 문자열 ("string", "number" 등)
 * @param value 실제 값
 * @returns 타입이 일치하면 true, 그렇지 않으면 false
 */
export function matchesType(expected: string, value: unknown): boolean {
    switch (expected) {
        case "string":
            return isString(value);
        case "number":
            return isNumber(value);
        case "boolean":
            return isBoolean(value);
        case "object":
            return isObjectLike(value) && !isArray(value) && !isNil(value);
        case "array":
            return isArray(value);
        case "null":
            return isNil(value);
        case "undefined":
            return isUndefined(value);
        case "function":
            return isFunction(value);
        default:
            return typeof value === expected;
    }
}

/**
 * 디버깅용 타입 이름을 사람이 읽기 쉬운 형태로 반환합니다.
 *
 * @param value 타입을 표시할 값
 * @returns 값의 타입을 나타내는 문자열
 */
export function prettyType(value: unknown): string {
    if (isNil(value)) return "null";
    if (isArray(value)) return "array";
    if (isString(value)) return "string";
    if (isNumber(value)) return "number";
    if (isBoolean(value)) return "boolean";
    if (typeof value === "function") return "function";
    if (isObjectLike(value)) return "object";
    return typeof value;
}
