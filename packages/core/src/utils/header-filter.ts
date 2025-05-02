import type { HttpHeaders } from "@/core";
import { toPairs } from "es-toolkit/compat";

export const DEFAULT_REQUEST_HEADER_BLACKLIST: string[] = ["cookie", "host", "content-length"];

export const DEFAULT_RESPONSE_HEADER_BLACKLIST: string[] = [
    "x-powered-by",
    "etag",
    "date",
    "connection",
    "content-length",
];

/**
 * 주어진 헤더에서 블랙리스트 항목을 제거
 *
 * @param headers - 입력 헤더
 * @param blacklist - 제외할 헤더 이름 배열
 * @returns 블랙리스트에 포함되지 않은 헤더
 */
export function filterHeadersByBlacklist(headers: HttpHeaders, blacklist: string[]): HttpHeaders {
    const blacklistLower = blacklist.map((header) => header.toLowerCase());
    const filtered: HttpHeaders = {};

    for (const [key, value] of toPairs(headers)) {
        if (!blacklistLower.includes(key.toLowerCase())) {
            filtered[key] = value;
        }
    }
    return filtered;
}

/**
 * 요청 헤더에서 블랙리스트 항목 제거
 */
export function filterRequestHeaders(headers: HttpHeaders): HttpHeaders {
    return filterHeadersByBlacklist(headers, DEFAULT_REQUEST_HEADER_BLACKLIST);
}

/**
 * 응답 헤더에서 블랙리스트 항목 제거
 */
export function filterResponseHeaders(headers: HttpHeaders): HttpHeaders {
    return filterHeadersByBlacklist(headers, DEFAULT_RESPONSE_HEADER_BLACKLIST);
}
