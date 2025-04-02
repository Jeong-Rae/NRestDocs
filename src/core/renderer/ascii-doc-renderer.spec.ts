import { beforeEach, describe, expect, it, vi } from "vitest";

import { SupertestResponse } from "../../types";
import { extractHttpRequest, extractHttpResponse } from "../extractor/http-trace-extractor";
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

import { AsciiDocRenderer } from "./ascii-doc-renderer";

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (extractHttpRequest as any).mockReturnValue(mockRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (extractHttpResponse as any).mockReturnValue(mockExtractedResponse);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateCurlSnippet as any).mockReturnValue("curl-request-snippet");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateHttpRequestSnippet as any).mockReturnValue("http-request-snippet");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateHttpResponseSnippet as any).mockReturnValue("http-response-snippet");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateRequestHeadersSnippet as any).mockReturnValue("request-headers-snippet");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (extractHttpRequest as any).mockReturnValue(mockRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (extractHttpResponse as any).mockReturnValue(mockExtractedResponse);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateCurlSnippet as any).mockReturnValue("curl-request-snippet");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateHttpRequestSnippet as any).mockReturnValue("http-request-snippet");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (extractHttpRequest as any).mockReturnValue(mockRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (extractHttpResponse as any).mockReturnValue(mockExtractedResponse);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateCurlSnippet as any).mockReturnValue("curl-request");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateHttpRequestSnippet as any).mockReturnValue("http-request");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateHttpResponseSnippet as any).mockReturnValue("http-response");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateRequestHeadersSnippet as any).mockReturnValue("request-headers");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generatePathParametersSnippet as any).mockReturnValue("path-parameters");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateRequestParametersSnippet as any).mockReturnValue("request-parameters");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateRequestPartsSnippet as any).mockReturnValue("request-parts");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateRequestFieldsSnippet as any).mockReturnValue("request-fields");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateResponseHeadersSnippet as any).mockReturnValue("response-headers");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    });
});
