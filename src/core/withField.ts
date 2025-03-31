import { FieldDescriptor, FieldType } from "../types/doc-options";

/**
 * type() 호출 이전 상태의 필드 빌더 인터페이스
 * 이 상태에서는 type() 메서드만 호출 가능
 */
export interface FieldBuilderStart {
    /**
     * 필드의 타입을 지정합니다.
     * @param type 필드 타입 ('string', 'number', 'boolean', 'object', 'array' 등)
     * @returns 타입이 지정된 후의 빌더 객체
     */
    type(type: FieldType): FieldBuilderOptional;
}

/**
 * type() 호출 이후 상태의 필드 빌더 인터페이스
 * 이 상태에서는 description(), optional(), toDescriptor() 메서드를 호출할 수 있습니다.
 */
export interface FieldBuilderOptional {
    /**
     * 필드에 설명을 추가합니다.
     * @param description 필드에 대한 설명
     * @returns 빌더 체인을 계속하기 위한 this
     */
    description(description: string): FieldBuilderOptional;

    /**
     * 필드를 선택적(optional)으로 표시합니다.
     * @returns 빌더 체인을 계속하기 위한 this
     */
    optional(): FieldBuilderOptional;

    /**
     * 빌더 체인을 종료하고 최종 FieldDescriptor 객체를 반환합니다.
     * @returns 완성된 필드 정보 객체
     */
    toDescriptor(): FieldDescriptor;
}

/**
 * 전체 FieldBuilder 타입 (Start + Optional)
 * - 타입 검사 또는 유틸함수에서 사용 가능
 */
export type FieldBuilder = FieldBuilderStart | FieldBuilderOptional;

/**
 * 필드 정보를 구성하기 위한 빌더 함수
 *
 * @example
 * ```typescript
 * withField('username').type('string').description('사용자 이름').optional()
 * ```
 *
 * @param fieldName 필드 이름
 * @returns 필드 빌더 객체 (체이닝 시작)
 */
export function withField(fieldName: string): FieldBuilderStart {
    const internal: FieldDescriptor = {
        field: fieldName,
        type: "string",
        description: "",
        optional: false,
    };

    // type() 이후 체이닝 빌더 객체
    const builder: FieldBuilderOptional = {
        description(description: string) {
            internal.description = description;
            return builder;
        },
        optional() {
            internal.optional = true;
            return builder;
        },
        toDescriptor() {
            return { ...internal };
        },
    };

    // 시작 빌더 반환: type() 호출이 필수
    return {
        type(type: FieldType) {
            internal.type = type;
            return builder;
        },
    };
}
