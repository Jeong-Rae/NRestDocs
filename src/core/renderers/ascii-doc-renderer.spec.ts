import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    generateCurlSnippet,
    generateHttpRequestSnippet,
    generateHttpResponseSnippet,
    generatePathParametersSnippet,
    generateRequestFieldsSnippet,
    generateRequestHeadersSnippet,
    generateRequestParametersSnippet,
    generateRequestPartsSnippet,
    generateResponseFieldsSnippet,
    generateResponseHeadersSnippet,
} from "../snippets";
import { extractHttpRequest, extractHttpResponse } from "../utils/http-trace-extractor";

import { AsciiDocRenderer } from "./ascii-doc-renderer";

import type { SupertestResponse } from "../../types";

// 모의 함수 설정
vi.mock("../extractor/http-trace-extractor", () => ({
    extractHttpRequest: vi.fn(),
    extractHttpResponse: vi.fn(),
}));

vi.mock("../snippets", () => ({
    generateCurlSnippet: vi.fn(),
    generateHttpRequestSnippet: vi.fn(),
    generateHttpResponseSnippet: vi.fn(),
    generatePathParametersSnippet: vi.fn(),
    generateRequestFieldsSnippet: vi.fn(),
    generateRequestHeadersSnippet: vi.fn(),
    generateRequestParametersSnippet: vi.fn(),
    generateRequestPartsSnippet: vi.fn(),
    generateResponseFieldsSnippet: vi.fn(),
    generateResponseHeadersSnippet: vi.fn(),
}));

describe("ascii-doc-renderer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("AsciiDocRenderer", () => {
        it("renderDocumentSnippets 메서드는 필수 스니펫과 선택적 스니펫을 생성한다", () => {
            // Given
            const mockResponse = {} as SupertestResponse;
            const mockRequest = {
                method: "POST",
                url: new URL("http://example.com/api/users"),
                headers: { "Content-Type": "application/json" },
                body: { name: "John", age: 30 },
            };
            const mockExtractedResponse = {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: { id: 1, name: "John" },
            };
            const mockOptions = {
                requestHeaders: [
                    {
                        name: "Content-Type",
                        type: "string",
                        description: "콘텐츠 타입",
                        optional: false,
                    },
                ],
                pathParameters: [
                    { name: "userId", type: "string", description: "사용자 ID", optional: false },
                ],
            };

            // 모의 함수 반환값 설정
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (extractHttpRequest as any).mockReturnValue(mockRequest);
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (extractHttpResponse as any).mockReturnValue(mockExtractedResponse);
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateCurlSnippet as any).mockReturnValue("curl-request-snippet");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateHttpRequestSnippet as any).mockReturnValue("http-request-snippet");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateHttpResponseSnippet as any).mockReturnValue("http-response-snippet");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateRequestHeadersSnippet as any).mockReturnValue("request-headers-snippet");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generatePathParametersSnippet as any).mockReturnValue("path-parameters-snippet");

            // When
            const renderer = new AsciiDocRenderer();
            const result = renderer.renderDocumentSnippets(mockResponse, mockOptions);

            // Then
            expect(extractHttpRequest).toHaveBeenCalledWith(mockResponse);
            expect(extractHttpResponse).toHaveBeenCalledWith(mockResponse);
            expect(generateCurlSnippet).toHaveBeenCalledWith(
                mockRequest.method,
                mockRequest.url,
                mockRequest.headers,
                mockRequest.body
            );
            expect(generateHttpRequestSnippet).toHaveBeenCalledWith(
                mockRequest.method,
                mockRequest.url,
                mockRequest.headers,
                mockRequest.body
            );
            expect(generateHttpResponseSnippet).toHaveBeenCalledWith(
                mockExtractedResponse.statusCode,
                mockExtractedResponse.headers,
                mockExtractedResponse.body
            );
            expect(generateRequestHeadersSnippet).toHaveBeenCalledWith(mockOptions.requestHeaders);
            expect(generatePathParametersSnippet).toHaveBeenCalledWith(mockOptions.pathParameters);
            expect(result).toEqual({
                "curl-request": "curl-request-snippet",
                "http-request": "http-request-snippet",
                "http-response": "http-response-snippet",
                "request-headers": "request-headers-snippet",
                "path-parameters": "path-parameters-snippet",
            });
        });

        it("선택적 스니펫 옵션이 비어있으면 해당 스니펫을 생성하지 않는다", () => {
            // Given
            const mockResponse = {} as SupertestResponse;
            const mockRequest = {
                method: "POST",
                url: new URL("http://example.com/api/users"),
                headers: { "Content-Type": "application/json" },
                body: { name: "John", age: 30 },
            };
            const mockExtractedResponse = {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: { id: 1, name: "John" },
            };
            const mockOptions = {
                requestHeaders: [],
                pathParameters: [],
                requestParameters: [],
                requestParts: [],
                requestFields: [],
                responseHeaders: [],
                responseFields: [],
            };

            // 모의 함수 반환값 설정
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (extractHttpRequest as any).mockReturnValue(mockRequest);
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (extractHttpResponse as any).mockReturnValue(mockExtractedResponse);
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateCurlSnippet as any).mockReturnValue("curl-request-snippet");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateHttpRequestSnippet as any).mockReturnValue("http-request-snippet");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateHttpResponseSnippet as any).mockReturnValue("http-response-snippet");

            // When
            const renderer = new AsciiDocRenderer();
            const result = renderer.renderDocumentSnippets(mockResponse, mockOptions);

            // Then
            expect(generateRequestHeadersSnippet).not.toHaveBeenCalled();
            expect(generatePathParametersSnippet).not.toHaveBeenCalled();
            expect(generateRequestParametersSnippet).not.toHaveBeenCalled();
            expect(generateRequestPartsSnippet).not.toHaveBeenCalled();
            expect(generateRequestFieldsSnippet).not.toHaveBeenCalled();
            expect(generateResponseHeadersSnippet).not.toHaveBeenCalled();
            expect(generateResponseFieldsSnippet).not.toHaveBeenCalled();
            expect(result).toEqual({
                "curl-request": "curl-request-snippet",
                "http-request": "http-request-snippet",
                "http-response": "http-response-snippet",
            });
        });

        it("모든 선택적 스니펫 옵션이 제공되면 해당 스니펫을 모두 생성한다", () => {
            // Given
            const mockResponse = {} as SupertestResponse;
            const mockRequest = {
                method: "POST",
                url: new URL("http://example.com/api/items"),
                headers: { "X-Custom-Header": "value" },
                body: { data: "payload" },
            };
            const mockExtractedResponse = {
                statusCode: 201,
                headers: { Location: "/api/items/1" },
                body: { id: 1 },
            };
            const mockOptions = {
                requestHeaders: [
                    {
                        name: "X-Custom-Header",
                        type: "string",
                        description: "Custom header",
                        optional: false,
                    },
                ],
                pathParameters: [
                    { name: "itemId", type: "number", description: "Item ID", optional: false },
                ],
                requestParameters: [
                    { name: "query", type: "string", description: "Search query", optional: true },
                ],
                requestParts: [
                    { name: "file", type: "string", description: "Uploaded file", optional: false },
                ],
                requestFields: [
                    { name: "data", type: "string", description: "Payload data", optional: false },
                ],
                responseHeaders: [
                    {
                        name: "Location",
                        type: "string",
                        description: "Resource location",
                        optional: false,
                    },
                ],
                responseFields: [
                    { name: "id", type: "number", description: "Created item ID", optional: false },
                ],
            };

            // 모의 함수 반환값 설정
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (extractHttpRequest as any).mockReturnValue(mockRequest);
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (extractHttpResponse as any).mockReturnValue(mockExtractedResponse);
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateCurlSnippet as any).mockReturnValue("curl-request");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateHttpRequestSnippet as any).mockReturnValue("http-request");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateHttpResponseSnippet as any).mockReturnValue("http-response");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateRequestHeadersSnippet as any).mockReturnValue("request-headers");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generatePathParametersSnippet as any).mockReturnValue("path-parameters");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateRequestParametersSnippet as any).mockReturnValue("request-parameters");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateRequestPartsSnippet as any).mockReturnValue("request-parts");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateRequestFieldsSnippet as any).mockReturnValue("request-fields");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateResponseHeadersSnippet as any).mockReturnValue("response-headers");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateResponseFieldsSnippet as any).mockReturnValue("response-fields");

            // When
            const renderer = new AsciiDocRenderer();
            const result = renderer.renderDocumentSnippets(mockResponse, mockOptions);

            // Then
            // 필수 스니펫 생성 확인
            expect(generateCurlSnippet).toHaveBeenCalled();
            expect(generateHttpRequestSnippet).toHaveBeenCalled();
            expect(generateHttpResponseSnippet).toHaveBeenCalled();

            // 모든 선택적 스니펫 생성 함수가 호출되었는지 확인
            expect(generateRequestHeadersSnippet).toHaveBeenCalledWith(mockOptions.requestHeaders);
            expect(generatePathParametersSnippet).toHaveBeenCalledWith(mockOptions.pathParameters);
            expect(generateRequestParametersSnippet).toHaveBeenCalledWith(
                mockOptions.requestParameters
            );
            expect(generateRequestPartsSnippet).toHaveBeenCalledWith(mockOptions.requestParts);
            expect(generateRequestFieldsSnippet).toHaveBeenCalledWith(mockOptions.requestFields);
            expect(generateResponseHeadersSnippet).toHaveBeenCalledWith(
                mockOptions.responseHeaders
            );
            expect(generateResponseFieldsSnippet).toHaveBeenCalledWith(mockOptions.responseFields);

            // 결과 SnippetMap에 모든 스니펫이 포함되었는지 확인
            expect(result).toEqual({
                "curl-request": "curl-request",
                "http-request": "http-request",
                "http-response": "http-response",
                "request-headers": "request-headers",
                "path-parameters": "path-parameters",
                "request-parameters": "request-parameters",
                "request-parts": "request-parts",
                "request-fields": "request-fields",
                "response-headers": "response-headers",
                "response-fields": "response-fields",
            });
        });

        it("options.operation이 제공되면 HTTP 메서드와 경로가 설정된다", () => {
            // Given
            const mockResponse = {
                request: {
                    method: "GET" as const,
                    url: "http://example.com/original-path",
                },
            } as unknown as SupertestResponse;
            const mockRequest = {
                method: "POST" as const,
                url: new URL("http://example.com/api/users"),
                headers: {},
                body: {},
            };
            const mockExtractedResponse = {
                statusCode: 200,
                headers: {},
                body: {},
            };
            const mockOptions = {
                operation: {
                    method: "PUT" as const,
                    path: "/api/users/updated",
                    servers: ["http://api.example.com", "http://api2.example.com"],
                },
            };

            // 모의 함수 반환값 설정
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (extractHttpRequest as any).mockReturnValue(mockRequest);
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (extractHttpResponse as any).mockReturnValue(mockExtractedResponse);
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateCurlSnippet as any).mockReturnValue("curl-request-snippet");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateHttpRequestSnippet as any).mockReturnValue("http-request-snippet");
            // biome-ignore lint/suspicious/noExplicitAny: use any
            (generateHttpResponseSnippet as any).mockReturnValue("http-response-snippet");

            // When
            const renderer = new AsciiDocRenderer();
            renderer.renderDocumentSnippets(mockResponse, mockOptions);

            // Then
            // options.operation 값이 request에 제대로 적용되었는지 확인
            expect(mockResponse.request.method).toBe(mockOptions.operation.method);
            expect(mockResponse.request.url).toBe(
                new URL(mockOptions.operation.path, mockOptions.operation.servers[0]).toString()
            );

            // extractHttpRequest가 업데이트된 request로 호출되었는지 확인
            expect(extractHttpRequest).toHaveBeenCalledWith(mockResponse);
        });
    });
});
