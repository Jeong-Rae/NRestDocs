import { HttpMethod } from "../../types/http";
import { Response } from "supertest";
import {
    FieldDescriptor,
    HeaderDescriptor,
    ParameterDescriptor,
    PartDescriptor,
    SnippetMap,
} from "../../types/descriptors";

export interface RenderDocumentSnippetsOptions {
    requestHeaders?: HeaderDescriptor[];
    pathParameters?: ParameterDescriptor[];
    requestParameters?: ParameterDescriptor[];
    requestParts?: PartDescriptor[];
    requestFields?: FieldDescriptor[];
    responseHeaders?: HeaderDescriptor[];
    responseFields?: FieldDescriptor[];
}

export interface RenderParams {
    identifier: string;
    method: HttpMethod;
    path: string;
    requestBody: unknown;
    responseBody: unknown;
}

export interface DocRenderer {
    /**
     * HTTP 요청/응답 정보를 기반으로 스니펫을 만들어낸다.
     * @param response HTTP 응답 객체
     * @param options 스니펫 생성 옵션
     * @returns 생성된 스니펫 맵
     */
    renderDocumentSnippets(response: Response, options: RenderDocumentSnippetsOptions): SnippetMap;
}
