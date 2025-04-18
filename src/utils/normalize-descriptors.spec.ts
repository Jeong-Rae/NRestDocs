import { describe, expect, it } from "vitest";

// DescriptorBuilder import는 더 이상 직접 사용되지 않으므로 제거 가능 (defineHeader를 통해 간접 사용)
// import { DescriptorBuilder } from "../builders/descriptor-builder";
import { defineHeader } from "../builders/defineHeader";

import { normalizeDescriptors } from "./normalize-descriptors";

import type { HeaderDescriptor } from "../types";
import type { PartialWithName } from "./normalize-descriptors";

// 테스트용 DescriptorBuilder 모의 클래스 제거

describe("normalize-descriptors", () => {
    describe("normalizeDescriptors", () => {
        it("DescriptorBuilder 인스턴스 배열을 처리해야 한다", () => {
            // Given
            const builder1 = defineHeader("Content-Type").description("컨텐츠 타입");
            const builder2 = defineHeader("Accept").description("허용 타입").optional();
            const descriptors = [builder1, builder2];

            // When
            const normalized = normalizeDescriptors(descriptors);

            // Then
            expect(normalized).toEqual([
                {
                    name: "Content-Type",
                    type: "string",
                    description: "컨텐츠 타입",
                    optional: false,
                },
                { name: "Accept", type: "string", description: "허용 타입", optional: true },
            ]);
        });

        it("Partial 객체 배열을 처리하고 기본값을 적용해야 한다", () => {
            // Given
            const partial1: PartialWithName<HeaderDescriptor> = {
                name: "X-Request-ID",
                description: "요청 ID",
            };
            const partial2: PartialWithName<HeaderDescriptor> = {
                name: "X-Optional-Header",
                type: "number",
                optional: true,
            };
            const descriptors = [partial1, partial2];

            // When
            const normalized = normalizeDescriptors(descriptors);

            // Then
            expect(normalized).toEqual([
                {
                    name: "X-Request-ID",
                    type: "string",
                    description: "요청 ID",
                    optional: false,
                },
                {
                    name: "X-Optional-Header",
                    type: "number",
                    description: undefined,
                    optional: true,
                },
            ]);
        });

        it("DescriptorBuilder와 Partial 객체가 혼합된 배열을 처리해야 한다", () => {
            // Given
            const builder = defineHeader("Authorization").description("인증 토큰");
            const partial: PartialWithName<HeaderDescriptor> = {
                name: "Cache-Control",
            };
            const descriptors = [builder, partial];

            // When
            const normalized = normalizeDescriptors(descriptors);

            // Then
            expect(normalized).toEqual([
                {
                    name: "Authorization",
                    type: "string",
                    description: "인증 토큰",
                    optional: false,
                },
                {
                    name: "Cache-Control",
                    type: "string",
                    description: undefined,
                    optional: false,
                },
            ]);
        });

        it("빈 배열을 처리해야 한다", () => {
            // Given
            const descriptors: (
                | ReturnType<typeof defineHeader>
                | PartialWithName<HeaderDescriptor>
            )[] = [];

            // When
            const normalized = normalizeDescriptors(descriptors);

            // Then
            expect(normalized).toEqual([]);
        });
    });
});
