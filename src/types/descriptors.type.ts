/**
 * 기본 Descriptor 타입
 * 모든 Descriptor 타입의 기본이 되는 공통 필드를 정의
 */
export type BaseDescriptor = {
    name: string;
    type: FieldType;
    description?: string;
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
export type FieldDescriptor = BaseDescriptor;

/** JSON 필드 타입 */
export type FieldType = string;

/** 스니펫 키 타입 */
export type SnippetKey =
    | "curl-request"
    | "http-request"
    | "http-response"
    | "request-headers"
    | "path-parameters"
    | "request-parameters"
    | "request-parts"
    | "request-fields"
    | "response-headers"
    | "response-fields";

/** 스니펫 맵 타입 */
export type SnippetMap = Record<SnippetKey, string>;
