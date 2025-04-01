import { FieldDescriptor } from "./descriptors";

/** 문서 포맷 타입 */
export type DocumentFormat = "adoc" | "md";

/** 전역 설정 타입 */
export type NRestDocsConfig = {
    /** 문서 스니펫 파일 출력 경로 */
    output: string;
    /** 문서 포맷 */
    format: DocumentFormat;
    /** strict 모드 시, 문서 정의와 실제 요청/응답 불일치 시 테스트 실패 */
    strict: boolean;
};

/** 테스트 코드에서 문서화 시 제공하는 옵션 */
export type DocOptions = {
    /** API에 대한 간단한 설명 */
    description?: string;

    /** 요청 JSON 필드 정보 */
    requestFields?: FieldDescriptor[];

    /** 응답 JSON 필드 정보 */
    responseFields?: FieldDescriptor[];

    // pathParams, queryParams, headers
};
