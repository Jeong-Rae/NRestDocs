import type { Response as SupertestResponseType } from "supertest";
import type { OpenAPI_V3_1 } from "./open-api-spec";

export type HttpMethod = Uppercase<OpenAPI_V3_1.HttpMethod>;

export type HttpHeaders = Record<string, string>;

export type HttpStatusCode = OpenAPI_V3_1.HttpStatusCode;

export type SupertestResponse = SupertestResponseType;

export type SupertestRequest = {
    _data?: unknown;
    header?: Record<string, string>;
    method?: HttpMethod;
    url?: string;
};

export type HttpRequest = {
    body: unknown;
    headers: Record<string, string>;
    method: HttpMethod;
    url: URL;
};

// 추출된 응답 정보 타입
export type HttpResponse = {
    body: unknown;
    headers: Record<string, string>;
    statusCode: HttpStatusCode;
};
