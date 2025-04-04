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

            it("description이 없는 경우 빈 문자열을 사용해야 한다", async () => {
                const builder = new DocRequestBuilder(mockResponsePromise);
                const identifier = "test-doc";

                await builder.doc(identifier);

                expect(renderSpy).toHaveBeenCalledWith(
                    mockResponse,
                    expect.objectContaining({
                        operation: expect.objectContaining({
                            description: "",
                        }),
                    })
                );
            });
        });

        describe("withOperation", () => {
            it("HTTP 메서드와 경로를 설정해야 한다", () => {
                // Given
                const builder = new DocRequestBuilder(mockResponsePromise);
                const method = "GET" as const;
                const path = "/api/users";

                // When
                const result = builder.withOperation(method, path);

                // Then
                expect(result).toBe(builder); // 메서드 체이닝이 가능하도록 this 반환
                expect(result).toBeInstanceOf(DocRequestBuilder);

                // private 속성 테스트를 위한 접근
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                expect((builder as any).httpMethod).toEqual(method);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                expect((builder as any).httpPath).toEqual(path);
            });

            it("doc 메서드 호출 시 operation 정보가 renderer에 전달되어야 한다", async () => {
                // Given
                const builder = new DocRequestBuilder(mockResponsePromise);
                const method = "POST" as const;
                const path = "/api/items";
                const servers = ["http://api.example.com", "http://api2.example.com"];
                const description = "아이템 생성 API";

                builder
                    .withOperation(method, path)
                    .withDescription(description)
                    .withServers(servers);

                const mockSnippetMap = { "http-request": "POST /api/items" };
                renderSpy.mockReturnValue(mockSnippetMap);

                // When
                await builder.doc("test-operation");

                // Then
                expect(renderSpy).toHaveBeenCalledWith(
                    mockResponse,
                    expect.objectContaining({
                        operation: {
                            method,
                            path,
                            description,
                            servers,
                        },
                    })
                );
            });
        });

        describe("withResponse", () => {
            it("상태 코드별 응답 정보를 설정해야 한다", () => {
                // Given
                const builder = new DocRequestBuilder(mockResponsePromise);
                const statusCode = 201;
                const responseInfo = {
                    headers: [defineHeader("Location").description("생성된 리소스 위치")],
                    fields: [
                        defineField("id").type("number").description("생성된 ID"),
                        defineField("createdAt").type("string").description("생성 일시"),
                    ],
                    description: "리소스 생성 성공",
                };

                // When
                const result = builder.withResponse(statusCode, responseInfo);

                // Then
                expect(result).toBe(builder); // 메서드 체이닝이 가능하도록 this 반환
                expect(result).toBeInstanceOf(DocRequestBuilder);

                // private 속성 테스트를 위한 접근
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const responses = (builder as any).responses;
                expect(responses[statusCode]).toBeDefined();
                expect(responses[statusCode].description).toEqual(responseInfo.description);
                expect(responses[statusCode].headers).toHaveLength(1);
                expect(responses[statusCode].fields).toHaveLength(2);
            });

            it("description이 제공되지 않으면 빈 문자열을 기본값으로 설정해야 한다", () => {
                // Given
                const builder = new DocRequestBuilder(mockResponsePromise);
                const statusCode = 400;
                const responseInfo = {
                    headers: [defineHeader("Content-Type").description("응답 타입")],
                    fields: [defineField("error").type("string").description("에러 메시지")],
                };

                // When
                builder.withResponse(statusCode, responseInfo);

                // Then
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const responses = (builder as any).responses;
                expect(responses[statusCode].description).toEqual("");
            });

            it("여러 상태 코드의 응답을 설정할 수 있어야 한다", () => {
                // Given
                const builder = new DocRequestBuilder(mockResponsePromise);

                // When
                builder.withResponse(200, {
                    description: "성공 응답",
                    fields: [defineField("result").type("object").description("결과 데이터")],
                });

                builder.withResponse(400, {
                    description: "잘못된 요청",
                    fields: [defineField("error").type("string").description("에러 메시지")],
                });

                builder.withResponse(500, {
                    description: "서버 오류",
                    fields: [defineField("message").type("string").description("오류 메시지")],
                });

                // Then
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const responses = (builder as any).responses;
                expect(Object.keys(responses)).toHaveLength(3);
                expect(responses[200]).toBeDefined();
                expect(responses[400]).toBeDefined();
                expect(responses[500]).toBeDefined();
            });

            it("응답 필드가 없는 경우 빈 배열을 설정해야 한다", () => {
                const builder = new DocRequestBuilder(mockResponsePromise);
                const statusCode = 200;
                const response = {
                    description: "성공 응답",
                };

                builder.withResponse(statusCode, response);

                expect(builder["responses"][statusCode].fields).toEqual([]);
            });

            it("응답 필드가 있는 경우 정규화된 필드를 설정해야 한다", () => {
                const builder = new DocRequestBuilder(mockResponsePromise);
                const statusCode = 200;
                const response = {
                    fields: [defineField("id").type("number")],
                    description: "성공 응답",
                };

                builder.withResponse(statusCode, response);

                expect(builder["responses"][statusCode].fields).toEqual([
                    {
                        name: "id",
                        type: "number",
                        description: "",
                        optional: false,
                    },
                ]);
            });
        });

        describe("withServer", () => {
            it("서버 URL을 추가하고 체이닝을 지원해야 한다", () => {
                const builder = new DocRequestBuilder(mockResponsePromise);
                const result = builder.withServers(["http://api.example.com"]);

                expect(result).toBe(builder);
                expect(builder["servers"]).toContain("http://api.example.com");
            });
        });
    });
});
