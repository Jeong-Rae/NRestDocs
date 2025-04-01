/**
 * 기본 Descriptor 타입
 * 모든 Descriptor 타입의 기본이 되는 공통 필드를 정의
 */
export type BaseDescriptor = {
    /** 필드/파라미터 이름 */
    name: string;
    /** 설명 */
    description?: string;
    /** 선택 여부 */
    optional?: boolean;
};

/**
 * HTTP 헤더 Descriptor
 */
export type HeaderDescriptor = BaseDescriptor;

/**
 * URL 파라미터 Descriptor
 */
export type ParameterDescriptor = BaseDescriptor;

/**
 * Multipart 요청의 Part Descriptor
 */
export type PartDescriptor = BaseDescriptor;

/**
 * JSON 필드 Descriptor
 */
export type FieldDescriptor = BaseDescriptor & {
    type: FieldType;
};

/** JSON 필드 타입 */
export type FieldType = string;
