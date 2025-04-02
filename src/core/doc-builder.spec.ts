import { beforeEach, describe, expect, it, vi } from "vitest";

import { defineField } from "./builders/defineField";
import { defineHeader } from "./builders/defineHeader";
import { definePart } from "./builders/definePart";
import { definePathParam } from "./builders/definePathParam";
import { defineQueryParam } from "./builders/defineQueryParam";
import * as configModule from "./config";
import { DocRequestBuilder, docRequest } from "./doc-builder";
import { AsciiDocRenderer } from "./renderer/ascii-doc-renderer";
import { LocalDocWriter } from "./writer/local-doc-writer";

import type { NRestDocsConfig } from "../types";
import type { Response } from "supertest";
import type { Mock } from "vitest";

// 모듈 모킹
vi.mock("./config");
vi.mock("./renderer/ascii-doc-renderer");
vi.mock("./writer/local-doc-writer");

// supertest Response 모의 객체 생성
const mockResponsePromise = Promise.resolve({ status: 200 } as Response);
const mockResponse = { status: 200 } as Response;
const mockConfig: NRestDocsConfig = {
    output: "test-docs",
    format: "adoc",
    strict: false,
};

describe("doc-builder", () => {
    describe("docRequest", () => {
        it("supertest Promise를 받아 DocRequestBuilder 인스턴스를 반환해야 한다", () => {
            // Given
            const supertestPromise = mockResponsePromise;

            // When
            const builder = docRequest(supertestPromise);

            // Then
            expect(builder).toBeInstanceOf(DocRequestBuilder);
        });
    });

    describe("DocRequestBuilder", () => {
        let renderSpy: Mock;
        let writeSpy: Mock;

        beforeEach(() => {
            vi.clearAllMocks();

            // getNRestDocsConfig 모킹
            vi.mocked(configModule.getNRestDocsConfig).mockReturnValue(mockConfig);

            // AsciiDocRenderer 모킹 설정
            renderSpy = vi.fn().mockReturnValue({}); // renderDocumentSnippets 모의 함수
            vi.mocked(AsciiDocRenderer).mockImplementation(
                () =>
                    ({
                        renderDocumentSnippets: renderSpy,
                    }) as unknown as AsciiDocRenderer
            );

            // LocalDocWriter 모킹 설정
            writeSpy = vi.fn().mockResolvedValue(undefined); // writeDocumentSnippets 모의 함수
            vi.mocked(LocalDocWriter).mockImplementation(
                () =>
                    ({
                        writeDocumentSnippets: writeSpy,
                    }) as unknown as LocalDocWriter
            );
        });

        describe("doc", () => {
            it("설정 로드, 렌더러 및 라이터 호출 후 응답을 반환해야 한다", async () => {
                // Given
                const builder = new DocRequestBuilder(mockResponsePromise);
                const identifier = "test-doc-call-basic";
                const expectedRenderOptions = {
                    requestHeaders: undefined,
                    pathParameters: undefined,
                    requestParameters: undefined,
                    requestParts: undefined,
                    requestFields: undefined,
                    responseHeaders: undefined,
                    responseFields: undefined,
                };
                const mockSnippetMap = { "http-request": "GET / HTTP/1.1" };
                renderSpy.mockReturnValue(mockSnippetMap);

                // When
                const result = await builder.doc(identifier);

                // Then
                expect(result).toStrictEqual(mockResponse);
                expect(configModule.getNRestDocsConfig).toHaveBeenCalledOnce();
                expect(AsciiDocRenderer).toHaveBeenCalledOnce();
                expect(renderSpy).toHaveBeenCalledOnce();
                expect(renderSpy).toHaveBeenCalledWith(
                    mockResponse,
                    expect.objectContaining(expectedRenderOptions)
                );
                expect(LocalDocWriter).toHaveBeenCalledOnce();
                expect(vi.mocked(LocalDocWriter).mock.calls[0][0]).toEqual({
                    outputDir: mockConfig.output,
                    extension: "adoc",
                    directoryStructure: "nested",
                });
                expect(writeSpy).toHaveBeenCalledOnce();
                expect(writeSpy).toHaveBeenCalledWith(identifier, mockSnippetMap);
            });

            it("모든 withXXX 메서드 호출 시 정규화된 데이터를 renderer에 전달해야 한다", async () => {
                // Given
                const builder = new DocRequestBuilder(mockResponsePromise);
                const identifier = "test-doc-call-all-with";

                const reqHeaders = [defineHeader("Content-Type").description("요청 타입")];
                const pathParams = [
                    definePathParam("userId").type("number").description("사용자 ID"),
                ];
                const reqParams = [
                    defineQueryParam("page").type("number").optional(),
                    defineQueryParam("query").type("string").description("검색어"),
                ];
                const reqParts = [definePart("file").type("file").description("업로드 파일")];
                const reqFields = [
                    defineField("username").type("string").description("사용자 이름"),
                ];
                const resHeaders = [defineHeader("X-RateLimit-Limit")];
                const resFields = [
                    defineField("id").type("number"),
                    defineField("data").type("object").optional(),
                ];

                // 예상되는 정규화된 데이터 (normalizeDescriptors 결과)
                const expectedRenderOptions = {
                    requestHeaders: [
                        {
                            name: "Content-Type",
                            type: "string",
                            description: "요청 타입",
                            optional: false,
                        },
                    ],
                    pathParameters: [
                        {
                            name: "userId",
                            type: "number",
                            description: "사용자 ID",
                            optional: false,
                        },
                    ],
                    requestParameters: [
                        { name: "page", type: "number", description: "", optional: true },
                        { name: "query", type: "string", description: "검색어", optional: false },
                    ],
                    requestParts: [
                        {
                            name: "file",
                            type: "file",
                            description: "업로드 파일",
                            optional: false,
                        },
                    ],
                    requestFields: [
                        {
                            name: "username",
                            type: "string",
                            description: "사용자 이름",
                            optional: false,
                        },
                    ],
                    responseHeaders: [
                        {
                            name: "X-RateLimit-Limit",
                            type: "string",
                            description: "",
                            optional: false,
                        },
                    ],
                    responseFields: [
                        { name: "id", type: "number", description: "", optional: false },
                        { name: "data", type: "object", description: "", optional: true },
                    ],
                };

                const mockSnippetMap = { "all-snippets": "..." };
                renderSpy.mockReturnValue(mockSnippetMap);

                // When
                builder
                    .withDescription("Test API Full Description")
                    .withRequestHeaders(reqHeaders)
                    .withPathParameters(pathParams)
                    .withRequestParameters(reqParams)
                    .withRequestParts(reqParts)
                    .withRequestFields(reqFields)
                    .withResponseHeaders(resHeaders)
                    .withResponseFields(resFields);

                const result = await builder.doc(identifier);

                // Then
                expect(result).toStrictEqual(mockResponse);
                expect(configModule.getNRestDocsConfig).toHaveBeenCalledOnce();
                expect(AsciiDocRenderer).toHaveBeenCalledOnce();
                expect(renderSpy).toHaveBeenCalledOnce();
                expect(renderSpy).toHaveBeenCalledWith(
                    mockResponse,
                    expect.objectContaining(expectedRenderOptions)
                );
                expect(LocalDocWriter).toHaveBeenCalledOnce();
                expect(writeSpy).toHaveBeenCalledOnce();
                expect(writeSpy).toHaveBeenCalledWith(identifier, mockSnippetMap);
            });

            it("config.output이 undefined일 때 기본 outputDir('./docs')을 사용해야 한다", async () => {
                // Given
                const configWithoutOutput = { ...mockConfig, output: undefined };
                vi.mocked(configModule.getNRestDocsConfig).mockReturnValueOnce(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    configWithoutOutput as any
                );

                const builder = new DocRequestBuilder(mockResponsePromise);
                const identifier = "test-doc-default-output";
                const expectedRenderOptions = {
                    requestHeaders: undefined,
                    pathParameters: undefined,
                    requestParameters: undefined,
                    requestParts: undefined,
                    requestFields: undefined,
                    responseHeaders: undefined,
                    responseFields: undefined,
                };
                const mockSnippetMap = { "default-output-test": "..." };
                renderSpy.mockReturnValue(mockSnippetMap);

                // When
                const result = await builder.doc(identifier);

                // Then
                expect(result).toStrictEqual(mockResponse);

                expect(configModule.getNRestDocsConfig).toHaveBeenCalledOnce();

                expect(AsciiDocRenderer).toHaveBeenCalledOnce();
                expect(renderSpy).toHaveBeenCalledOnce();
                expect(renderSpy).toHaveBeenCalledWith(
                    mockResponse,
                    expect.objectContaining(expectedRenderOptions)
                );

                expect(LocalDocWriter).toHaveBeenCalledOnce();
                expect(vi.mocked(LocalDocWriter).mock.calls[0][0]).toEqual({
                    outputDir: "./docs",
                    extension: "adoc",
                    directoryStructure: "nested",
                });
                expect(writeSpy).toHaveBeenCalledOnce();
                expect(writeSpy).toHaveBeenCalledWith(identifier, mockSnippetMap);
            });
        });
    });
});
