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
            (extractHttpRequest as any).mockReturnValue(mockRequest);
            (extractHttpResponse as any).mockReturnValue(mockExtractedResponse);
            (generateCurlSnippet as any).mockReturnValue("curl-request-snippet");
            (generateHttpRequestSnippet as any).mockReturnValue("http-request-snippet");
            (generateHttpResponseSnippet as any).mockReturnValue("http-response-snippet");
            (generateRequestHeadersSnippet as any).mockReturnValue("request-headers-snippet");
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
            (extractHttpRequest as any).mockReturnValue(mockRequest);
            (extractHttpResponse as any).mockReturnValue(mockExtractedResponse);
            (generateCurlSnippet as any).mockReturnValue("curl-request-snippet");
            (generateHttpRequestSnippet as any).mockReturnValue("http-request-snippet");
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
    });
});
