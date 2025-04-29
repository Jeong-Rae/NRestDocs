import type {
    HttpMethod,
    HttpQuery,
    HttpRequest,
    HttpResponse,
    HttpStatusCode,
    SupertestRequest,
    SupertestResponse,
} from "@/types";

/**
 * Supertest 응답 객체에서 요청 정보를 추출합니다.
 * @param response Supertest 응답 객체
 * @returns 추출된 요청 정보
 */
export function extractHttpRequest(response: SupertestResponse): HttpRequest {
    const request = response.request as SupertestRequest & { qs?: HttpQuery };
    return {
        method: request.method as HttpMethod,
        url: new URL(request?.url || "", "http://localhost"),
        headers: request?.header ?? {},
        cookies: request?.header?.["Cookie"] ?? "",
        query: request?.qs ?? {},
        body: request?._data ?? {},
    };
}

/**
 * Supertest 응답 객체에서 응답 정보를 추출합니다.
 * @param response Supertest 응답 객체
 * @returns 추출된 응답 정보
 */
export function extractHttpResponse(response: SupertestResponse): HttpResponse {
    return {
        body: response.body ?? {},
        headers: response.headers ?? {},
        statusCode: response.status as HttpStatusCode,
    };
}
