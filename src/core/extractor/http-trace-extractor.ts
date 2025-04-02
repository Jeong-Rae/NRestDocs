import { Request, Response, SupertestRequest, SupertestResponse } from "../../types/http-trace";

/**
 * Supertest 응답 객체에서 요청 정보를 추출합니다.
 * @param response Supertest 응답 객체
 * @returns 추출된 요청 정보
 */
export function extractHttpRequest(response: SupertestResponse): Request {
    const request = response.request as SupertestRequest;
    return {
        body: request?._data ?? {},
        headers: request?.header ?? {},
        method: request?.method ?? "GET",
        url: new URL(request?.url || "", "http://localhost"), // 기본 URL 추가
    };
}

/**
 * Supertest 응답 객체에서 응답 정보를 추출합니다.
 * @param response Supertest 응답 객체
 * @returns 추출된 응답 정보
 */
export function extractHttpResponse(response: SupertestResponse): Response {
    return {
        body: response.body ?? {},
        headers: response.headers ?? {},
        statusCode: response.status,
    };
}
