import { getNRestDocsConfig } from "@/config/config";
import { AsciiDocRenderer } from "@/renderers/ascii-doc-renderer";
import { normalizeDescriptors } from "@/utils/normalize-descriptors";
import { LocalDocWriter } from "@/writers/local-doc-writer";

import type { CookieDescriptor } from "@/descriptors";
import {
    type FieldInput,
    type FormParamsInput,
    type PathParamsInput,
    type QueryParamsInput,
    type RequestCookieInput,
    type RequestHeaderInput,
    type RequestPartInput,
    applyFields,
    applyFormParameters,
    applyPathParameters,
    applyQueryParameters,
    applyRequestCookie,
    applyRequestHeader,
    applyRequestPart,
} from "@/inputs";
import type {
    FieldDescriptor,
    HeaderDescriptor,
    HttpMethod,
    HttpStatusCode,
    ParameterDescriptor,
    PartDescriptor,
    ResponseDescriptor,
} from "@/types";
import type { Response } from "supertest";
import type { DescriptorBuilder } from "./descriptor-builder";

export class DocRequestBuilder {
    private readonly supertestPromise: Promise<Response>;

    private pathParameters?: ParameterDescriptor[];
    // @ts-ignore
    private queryParameters?: ParameterDescriptor[];
    // @ts-ignore
    private formParameters?: ParameterDescriptor[];

    private requestParts?: PartDescriptor[];

    private requestHeaders?: HeaderDescriptor[];
    // @ts-ignore
    private requestCookies?: CookieDescriptor[];

    private requestParameters?: ParameterDescriptor[];
    private requestFields?: FieldDescriptor[];

    private responseHeaders?: HeaderDescriptor[];
    private responseFields?: FieldDescriptor[];

    private responses: Record<HttpStatusCode, ResponseDescriptor> = {};

    private httpMethod?: HttpMethod;
    private httpPath?: string;
    private servers: string[] = [];
    private description: string = "";

    constructor(supertestPromise: Promise<Response>) {
        this.supertestPromise = supertestPromise;
    }

    /**
     * Response Fields를 등록할 수 있다.
     * @param fields {FieldInput} 등록 가능한 Field 입력
     * @example
     * / withResponseFields([ defineField("user.name").type("string"), defineField("user.age").type("number") ])
     * / withResponseFields([ { name: "user.name", "type": "string" }, { name: "user.age", "type": "number" } ])
     * / withResponseFields({ user: { name: { type: "string" }, age: { type: "number" } } })
     * @returns
     */
    withResponseFields(fields: FieldInput): this {
        this.responseFields = applyFields(fields);
        return this;
    }

    /**
     * Request Fields를 등록할 수 있다.
     * @param fields {FieldInput} 등록 가능한 Field 입력
     * @returns
     * @example
     * / withRequestFields([ defineField("user.name").type("string"), defineField("user.age").type("number") ])
     * / withRequestFields([ { name: "user.name", "type": "string" }, { name: "user.age", "type": "number" } ])
     * / withRequestFields({ user: { name: { type: "string" }, age: { type: "number" } } })
     */
    withRequestFields(fields: FieldInput): this {
        this.requestFields = applyFields(fields);
        return this;
    }

    /**
     * Query Parameters를 등록할 수 있다.
     * @param params {QueryParamsInput} 등록 가능한 Parameter 입력 배열 또는 레코드
     * @example
     * / withQueryParameters([ defineQuery("page").type("number").format("int32"), defineQuery("limit").type("number").format("int32") ])
     * / withQueryParameters([ { name: "page", "type": "number", "format": "int32" }, { name: "limit", "type": "number", "format": "int32" } ])
     * / withQueryParameters({ page: { type: "number", "format": "int32" }, limit: { type: "number", "format": "int32" } })
     * @returns
     */
    withQueryParameters(params: QueryParamsInput): this {
        this.queryParameters = applyQueryParameters(params);
        return this;
    }

    /**
     * Form Parameters를 등록할 수 있다.
     * @param params {FormParamsInput} 등록 가능한 Parameter 입력 배열 또는 레코드
     * @example
     * / withFormParameters([ defineForm("username").type("string").format("email"), defineForm("password").type("string").format("password") ])
     * / withFormParameters([ { name: "username", "type": "string", "format": "email" }, { name: "password", "type": "string", "format": "password" } ])
     * / withFormParameters({ username: { type: "string", "format": "email" }, password: { type: "string", "format": "password" } })
     * @returns
     */
    withFormParameters(params: FormParamsInput): this {
        this.formParameters = applyFormParameters(params);
        return this;
    }

    /**
     * Path Parameters를 등록할 수 있다.
     * @param params {PathParamsInput} 등록 가능한 Parameter 입력 배열 또는 레코드
     * @example
     * / withPathParameters([ definePath("userId").type("string").format("uuid"), definePath("postId").type("string").format("uuid") ])
     * / withPathParameters([ { name: "userId", "type": "string", "format": "uuid" }, { name: "postId", "type": "string", "format": "uuid" } ])
     * / withPathParameters({ userId: { type: "string", "format": "uuid" }, postId: { type: "string", "format": "uuid" } })
     * @returns
     */
    withPathParameters(params: PathParamsInput): this {
        this.pathParameters = applyPathParameters(params);
        return this;
    }

    /**
     * Request Part를 등록할 수 있다.
     * @param params {RequestPartInput} 등록 가능한 Parameter 입력 배열 또는 레코드
     * @example
     * / withRequestParts([ definePart("file").type("string").format("binary"), definePart("metadata").type("object") ])
     * / withRequestParts([ { name: "file", "type": "string", "format": "binary" }, { name: "metadata", "type": "object" } ])
     * / withRequestParts({ file: { type: "string", "format": "binary" }, metadata: { type: "object" } })
     * @returns
     */
    withRequestParts(params: RequestPartInput): this {
        this.requestParts = applyRequestPart(params);
        return this;
    }

    /**
     * Request Part의 바디를 등록할 수 있다.
     * @param partName {string} 등록 가능한 Part 이름
     * @returns
     * @example
     * / ("metadata")
     */
    withRequestPartBody(partName: string): this {
        return this;
    }

    /**
     * Request Part의 필드를 등록할 수 있다.
     * @param partName {string} 등록 가능한 Part 이름
     * @param fields {FieldInput[]} 등록 가능한 Field 배열
     * @returns
     * @example
     * / withRequestPartFields("metadata", [ defineField("name").type("string"), defineField("size").type("number") ])
     */
    withRequestPartFields(partName: string, fields: []): this {
        return this;
    }

    /**
     * Request Header를 등록할 수 있다.
     * @param headers {RequestHeaderInput} 등록 가능한 Header 입력 배열 또는 레코드
     * @returns
     * @example
     * / withRequestHeaders([ defineHeader("Authorization"), defineHeader("X-Forwarded-For") ])
     * / withRequestHeaders([ { name: "Authorization" }, { name: "X-Forwarded-For" } ])
     * / withRequestHeaders({ Authorization: {}, "X-Forwarded-For": {} })
     */
    withRequestHeaders(headers: RequestHeaderInput): this {
        this.requestHeaders = applyRequestHeader(headers);
        return this;
    }

    /**
     * Cookie를 등록할 수 있다.
     * @param cookies {RequestCookieInput} 등록 가능한 Cookie 입력 배열 또는 레코드
     * @returns
     * @example
     * / withRequestCookies([ defineCookie("connect.sid").type("string").format("base64") ])
     * / withRequestCookies([ { name: "connect.sid", "type": "string", "format": "base64" } ])
     * / withRequestCookies({ connect.sid: { type: "string", "format": "base64" } })
     */
    withRequestCookies(cookies: RequestCookieInput): this {
        this.requestCookies = applyRequestCookie(cookies);
        return this;
    }

    /** HTTP 메서드 & 경로 */
    withOperation(method: HttpMethod, path: string): this {
        this.httpMethod = method;
        this.httpPath = path;
        return this;
    }

    /** 다중 서버 설정 (OpenAPI servers) */
    withServers(servers: string[]): this {
        this.servers = servers;
        return this;
    }

    /** API 설명 추가 */
    withDescription(description: string): this {
        this.description = description;
        return this;
    }

    /**
     * response-headers 정의
     */
    withResponseHeaders(headers: (DescriptorBuilder<HeaderDescriptor> | HeaderDescriptor)[]): this {
        this.responseHeaders = normalizeDescriptors(headers);
        return this;
    }

    /**
     * supertest 요청을 실행하고, 설정된 옵션과 응답 정보를 콘솔에 출력
     */
    async doc(identifier: string): Promise<Response> {
        const response = await this.supertestPromise;
        const config = getNRestDocsConfig();

        const renderer = new AsciiDocRenderer();
        const snippetMap = renderer.renderDocumentSnippets(response, {
            requestHeaders: this.requestHeaders,
            pathParameters: this.pathParameters,
            requestParameters: this.requestParameters,
            requestParts: this.requestParts,
            requestFields: this.requestFields,
            responseHeaders: this.responseHeaders,
            responseFields: this.responseFields,
            responses: this.responses,
            operation: {
                method: this.httpMethod,
                path: this.httpPath,
                description: this.description,
                servers: this.servers,
            },
        });

        const writer = new LocalDocWriter({
            outputDir: config.output ?? "./docs",
            extension: "adoc",
            directoryStructure: "nested",
        });

        await writer.writeDocumentSnippets(identifier, snippetMap);

        return response;
    }
}

/** supertest Promise를 받아 DocRequestBuilder로 감싸기 */
export function docRequest(supertestPromise: Promise<Response>): DocRequestBuilder {
    return new DocRequestBuilder(supertestPromise);
}
