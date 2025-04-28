import type { Response as SupertestResponseType } from "supertest";
import type { OpenAPI_V3_1 } from "./open-api-spec";

export type HttpMethod = Uppercase<OpenAPI_V3_1.HttpMethod>;

export type HttpHeaders = Record<string, string>;

export type HttpCookies = string;

export type HttpBody = Record<string, unknown>;

export type HttpQuery = Record<string, unknown>;

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
    cookies: string;
    url: URL;
    query: HttpQuery;
};

export type HttpResponse = {
    body: unknown;
    headers: Record<string, string>;
    statusCode: HttpStatusCode;
};
