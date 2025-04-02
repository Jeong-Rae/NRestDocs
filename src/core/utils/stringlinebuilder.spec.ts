import { describe, expect, it } from "vitest";

import { StringLineBuilder } from "./stringlinebuilder";

describe("stringlinebuilder", () => {
    describe("StringLineBuilder", () => {
        it("기본 구분자로 문자열 라인을 생성한다", () => {
            // Given
            const builder = new StringLineBuilder();

            // When
            const result = builder
                .append("1st line")
                .append("2nd line")
                .append("3rd line")
                .toString();

            // Then
            expect(result).toBe("1st line\n2nd line\n3rd line");
        });

        it("사용자 정의 구분자로 문자열 라인을 생성한다", () => {
            // Given
            const builder = new StringLineBuilder(" | ");

            // When
            const result = builder
                .append("1st line")
                .append("2nd line")
                .append("3rd line")
                .toString();

            // Then
            expect(result).toBe("1st line | 2nd line | 3rd line");
        });

        it("빈 라인을 추가할 수 있다", () => {
            // Given
            const builder = new StringLineBuilder();

            // When
            const result = builder.append("1st line").append("").append("3rd line").toString();

            // Then
            expect(result).toBe("1st line\n\n3rd line");
        });
    });
});
