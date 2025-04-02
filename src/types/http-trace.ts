import { Response as SupertestResponseType } from "supertest";

import { HttpMethod } from "./http";

export type SupertestResponse = SupertestResponseType;

export type SupertestRequest = {
    _data?: unknown;
    header?: Record<string, string>;
    method?: HttpMethod;
    url?: string;
};

export type Request = {
    body: unknown;
    headers: Record<string, string>;
    method: HttpMethod;
    url: URL;
};

// 추출된 응답 정보 타입
export type Response = {
    body: unknown;
    headers: Record<string, string>;
    statusCode: number;
};
