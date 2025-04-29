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
