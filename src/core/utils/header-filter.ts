import {
    DEFAULT_REQUEST_HEADER_WHITELIST,
    DEFAULT_RESPONSE_HEADER_WHITELIST,
} from "../constants/http";

import type { HttpHeaders } from "../../types";

/**
 * 주어진 헤더를, 허용된 헤더 목록만 필터링한다.
 *
 * @param headers - 입력 헤더
 * @param allowedList - 허용할 헤더 이름 배열
 * @returns 허용된 헤더만 포함한 헤더
 */
export function filterHeaders(headers: HttpHeaders, allowedList: string[]): HttpHeaders {
    const allowedLower = allowedList.map((header) => header.toLowerCase());
    const filtered: HttpHeaders = {};

    for (const [key, value] of Object.entries(headers)) {
        if (allowedLower.includes(key.toLowerCase())) {
            filtered[key] = value;
        }
    }
    return filtered;
}

/**
 * 요청 헤더를 기본 요청 헤더 whitelist로 필터링
 * @param headers - 입력 요청 헤더
 * @returns 필터링된 요청 헤더
 */
export function filterRequestHeaders(headers: HttpHeaders): HttpHeaders {
    return filterHeaders(headers, DEFAULT_REQUEST_HEADER_WHITELIST);
}

/**
 * 응답 헤더를 기본 응답 헤더 whitelist로 필터링
 * @param headers - 입력 응답 헤더
 * @returns 필터링된 응답 헤더
 */
export function filterResponseHeaders(headers: HttpHeaders): HttpHeaders {
    return filterHeaders(headers, DEFAULT_RESPONSE_HEADER_WHITELIST);
}
