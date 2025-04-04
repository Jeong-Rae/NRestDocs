import type {
    FieldDescriptor,
    HeaderDescriptor,
    HttpMethod,
    OperationDescriptor,
    ParameterDescriptor,
    PartDescriptor,
    SnippetMap,
    SupertestResponse,
} from "../../types";

export type RenderDocumentSnippetsOptions = {
    requestHeaders?: HeaderDescriptor[];
    pathParameters?: ParameterDescriptor[];
    requestParameters?: ParameterDescriptor[];
    requestParts?: PartDescriptor[];
    requestFields?: FieldDescriptor[];
    responseHeaders?: HeaderDescriptor[];
    responseFields?: FieldDescriptor[];
    operation?: Partial<OperationDescriptor>;
};

export type RenderParams = {
    identifier: string;
    method: HttpMethod;
    path: string;
    requestBody: unknown;
    responseBody: unknown;
};

export type DocRenderer = {
    /**
     * HTTP 요청/응답 정보를 기반으로 모든 스니펫을 생성합니다.
     * @param response HTTP 응답 객체
     * @param options 스니펫 생성 옵션
     * @returns 생성된 스니펫 맵
     */
    renderDocumentSnippets(
        response: SupertestResponse,
        options: RenderDocumentSnippetsOptions
    ): SnippetMap;
};
