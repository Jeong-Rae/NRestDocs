import { FieldDescriptor, FieldType } from "../types/descriptors";

/**
 * 외부에 노출할 빌더 체이닝 타입 (type() 이후 상태)
 */
export interface FieldBuilder {
    description(description: string): FieldBuilder;
    optional(): FieldBuilder;
    toDescriptor(): FieldDescriptor;
}

/**
 * type() 호출 전 상태
 * - type() 호출 이후엔 FieldBuilder 체이닝 가능
 */
export interface FieldBuilderBegin {
    type(fieldType: FieldType): FieldBuilder;
}

/**
 * 필드 정보를 구성하기 위한 빌더 함수
 */
export function definedField(fieldName: string): FieldBuilderBegin {
    const _internal: FieldDescriptor = {
        name: fieldName,
        type: "string",
        description: "",
        optional: false,
    };

    const builder: FieldBuilder = {
        description(description: string): FieldBuilder {
            _internal.description = description;
            return builder;
        },
        optional(): FieldBuilder {
            _internal.optional = true;
            return builder;
        },
        toDescriptor(): FieldDescriptor {
            return { ..._internal };
        },
    };

    const fieldBuilderBegin: FieldBuilderBegin = {
        type(fieldType: FieldType): FieldBuilder {
            _internal.type = fieldType;
            return builder;
        },
    };

    return fieldBuilderBegin;
}
