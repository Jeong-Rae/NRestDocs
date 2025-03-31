import { FieldDescriptor, FieldType } from "../types/doc-options";

/**
 * type() 호출 이전 상태
 */
export interface FieldBuilderStart {
    type(t: FieldType): FieldBuilderOptional;
}

/**
 * type() 호출 이후 상태
 * - description(), optional() 체이닝 가능
 * - toDescriptor()로 최종 FieldDescriptor 추출
 */
export interface FieldBuilderOptional {
    description(desc: string): FieldBuilderOptional;
    optional(): FieldBuilderOptional;
    toDescriptor(): FieldDescriptor;
}

/**
 * 전체 FieldBuilder 총칭 타입 (Start + Optional)
 * - 타입 검사 또는 유틸함수에서 사용 가능
 */
export type FieldBuilder = FieldBuilderStart | FieldBuilderOptional;

/**
 * withField("name") → 체이닝 빌더 시작
 */
export function withField(fieldName: string): FieldBuilderStart {
    // 내부 상태
    const internal: FieldDescriptor = {
        field: fieldName,
        type: "string", // type() 호출로 반드시 덮어써야 함
        description: "",
        optional: false,
    };

    // type() 이후 체이닝 빌더 객체
    const builder: FieldBuilderOptional = {
        description(desc: string) {
            internal.description = desc;
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
