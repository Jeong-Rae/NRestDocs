import { describe, expect, it } from "vitest";

import { matchesType, prettyType } from "./type-checker";

describe("type-checker", () => {
    describe("matchesType", () => {
        it("기본 타입을 올바르게 검사해야 한다", () => {
            expect(matchesType("string", "hello")).toBe(true);
            expect(matchesType("string", 123)).toBe(false);
            expect(matchesType("number", 123)).toBe(true);
            expect(matchesType("number", "123")).toBe(false);
            expect(matchesType("boolean", true)).toBe(true);
            expect(matchesType("boolean", "true")).toBe(false);
            expect(matchesType("undefined", undefined)).toBe(true);
            expect(matchesType("undefined", null)).toBe(false);
            expect(matchesType("null", null)).toBe(true);
            expect(matchesType("null", undefined)).toBe(true);
            expect(matchesType("null", 0)).toBe(false);
        });

        it("객체 타입을 올바르게 검사해야 한다 (배열, null, undefined, 함수 제외)", () => {
            expect(matchesType("object", { a: 1 })).toBe(true);
            expect(matchesType("object", [1, 2])).toBe(false);
            expect(matchesType("object", null)).toBe(false);
            expect(matchesType("object", undefined)).toBe(false);
            expect(matchesType("object", "string")).toBe(false);
            // biome-ignore lint/suspicious/noEmptyBlockStatements: 테스트용 빈 함수
            expect(matchesType("object", () => {})).toBe(false);
        });

        it("배열 타입을 올바르게 검사해야 한다", () => {
            expect(matchesType("array", [1, 2])).toBe(true);
            expect(matchesType("array", { length: 2 })).toBe(false);
            expect(matchesType("array", "[1, 2]")).toBe(false);
            expect(matchesType("array", null)).toBe(false);
        });

        it("typeof로 비교되는 다른 타입들을 처리해야 한다", () => {
            // biome-ignore lint/suspicious/noEmptyBlockStatements: 테스트용 빈 함수
            expect(matchesType("function", () => {})).toBe(true);
            expect(matchesType("function", {})).toBe(false);
            expect(matchesType("symbol", Symbol("test"))).toBe(true);
            expect(matchesType("bigint", BigInt(123))).toBe(true);
        });

        it("알 수 없는 예상 타입 문자열은 false를 반환해야 한다 (typeof 비교 실패 시)", () => {
            expect(matchesType("unknownType", "string")).toBe(false);
            expect(matchesType("unknownType", 123)).toBe(false);
        });
    });

    describe("prettyType", () => {
        it("기본 타입을 올바른 문자열로 반환해야 한다", () => {
            expect(prettyType("hello")).toBe("string");
            expect(prettyType(123)).toBe("number");
            expect(prettyType(true)).toBe("boolean");
            expect(prettyType(undefined)).toBe("null");
            expect(prettyType(null)).toBe("null");
        });

        it("객체와 배열 타입을 올바른 문자열로 반환해야 한다", () => {
            expect(prettyType({ a: 1 })).toBe("object");
            expect(prettyType([1, 2])).toBe("array");
        });

        it("함수 타입을 'function'으로 반환해야 한다", () => {
            // biome-ignore lint/suspicious/noEmptyBlockStatements: 테스트용 빈 함수
            expect(prettyType(() => {})).toBe("function");
        });

        it("다른 typeof 기반 타입들을 올바르게 반환해야 한다", () => {
            const symbol = Symbol("test");
            expect(prettyType(symbol)).toBe("symbol");
            const bigint = BigInt(123);
            expect(prettyType(bigint)).toBe("bigint");
        });
    });
});
