/**
 * 문서화에 허용할 요청 헤더 목록
 */
export const DEFAULT_REQUEST_HEADER_WHITELIST: string[] = [
    "accept",
    "authorization",
    "content-type",
    "user-agent",
];

/**
 * 문서화 허용할 응답 헤더 목록
 */
export const DEFAULT_RESPONSE_HEADER_WHITELIST: string[] = [
    "content-type",
    "content-length",
    "cache-control",
];
