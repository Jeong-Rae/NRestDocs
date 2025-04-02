import { describe, expect, it } from "vitest";

import { BaseDescriptor } from "../../types/descriptors";

import { createDescriptorBuilder } from "./descriptor-builder";

describe("descriptor-builder", () => {
    describe("createDescriptorBuilder", () => {
        it("기본 descriptor를 생성한다", () => {
            // Given
            const baseDescriptor: BaseDescriptor = {
                name: "test",
                type: "string",
                description: "",
                optional: false,
            };

            // When
            const builder = createDescriptorBuilder(baseDescriptor);

            // Then
            expect(builder).toBeDefined();
            expect(typeof builder.type).toBe("function");
        });

        it("type 메서드를 호출하면 descriptor의 type이 변경된다", () => {
            // Given
            const baseDescriptor: BaseDescriptor = {
                name: "test",
                type: "string",
                description: "",
                optional: false,
            };
            const builder = createDescriptorBuilder(baseDescriptor);

            // When
            const result = builder.type("number");

            // Then
            expect(result).toBeDefined();
            expect(typeof result.description).toBe("function");
            expect(typeof result.optional).toBe("function");
            expect(typeof result.toDescriptor).toBe("function");
        });

        it("description 메서드를 호출하면 descriptor의 description이 변경된다", () => {
            // Given
            const baseDescriptor: BaseDescriptor = {
                name: "test",
                type: "string",
                description: "",
                optional: false,
            };
            const builder = createDescriptorBuilder(baseDescriptor).type("string");

            // When
            const result = builder.description("테스트 설명");

            // Then
            expect(result).toBeDefined();
            const descriptor = result.toDescriptor();
            expect(descriptor.description).toBe("테스트 설명");
        });

        it("optional 메서드를 호출하면 descriptor의 optional이 true로 변경된다", () => {
            // Given
            const baseDescriptor: BaseDescriptor = {
                name: "test",
                type: "string",
                description: "",
                optional: false,
            };
            const builder = createDescriptorBuilder(baseDescriptor).type("string");

            // When
            const result = builder.optional();

            // Then
            expect(result).toBeDefined();
            const descriptor = result.toDescriptor();
            expect(descriptor.optional).toBe(true);
        });

        it("toDescriptor 메서드를 호출하면 현재 상태의 descriptor를 반환한다", () => {
            // Given
            const baseDescriptor: BaseDescriptor = {
                name: "test",
                type: "string",
                description: "",
                optional: false,
            };
            const builder = createDescriptorBuilder(baseDescriptor)
                .type("number")
                .description("테스트 설명")
                .optional();

            // When
            const result = builder.toDescriptor();

            // Then
            expect(result).toEqual({
                name: "test",
                type: "number",
                description: "테스트 설명",
                optional: true,
            });
        });
    });
});
