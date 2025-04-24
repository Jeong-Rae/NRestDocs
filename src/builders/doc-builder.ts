import { getNRestDocsConfig } from "../config/config";
import { AsciiDocRenderer } from "../renderers/ascii-doc-renderer";
import { normalizeDescriptors } from "../utils/normalize-descriptors";
import { LocalDocWriter } from "../writers/local-doc-writer";

import type { Response } from "supertest";
import {
    type PathParamsInput,
    type QueryParamsInput,
    applyPathParameters,
    applyQueryParameters,
} from "../inputs";
import type {
    FieldDescriptor,
    HeaderDescriptor,
    HttpMethod,
    HttpStatusCode,
    ParameterDescriptor,
    PartDescriptor,
    ResponseDescriptor,
} from "../types";
import type { PartialWithName } from "../utils/normalize-descriptors";
import type { DescriptorBuilder } from "./descriptor-builder";

export class DocRequestBuilder {
    private readonly supertestPromise: Promise<Response>;

    private requestHeaders?: HeaderDescriptor[];

    private pathParameters?: ParameterDescriptor[];
    private queryParameters?: ParameterDescriptor[];

    private requestParameters?: ParameterDescriptor[];
    private requestParts?: PartDescriptor[];
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
     * request-headers 정의
     */
    withRequestHeaders(
        headers: (DescriptorBuilder<HeaderDescriptor> | PartialWithName<HeaderDescriptor>)[]
    ): this {
        this.requestHeaders = normalizeDescriptors(headers);
        return this;
    }

    /**
     * Path Parameters를 등록할 수 있다.
     * @param params {PathParamsInput} 등록 가능한 Parameter 입력 배열 또는 레코드
     * @example
     * / [ definePathParam("name").type("string") ]
     * / [ { name: "name", "type": "string" } ]
     * / { name: { type: "string" } }
     * @returns
     */
    withPathParameters(params: PathParamsInput): this {
        this.pathParameters = applyPathParameters(params);
        return this;
    }

    /**
     * Query Parameters를 등록할 수 있다.
     * @param params {QueryParamsInput} 등록 가능한 Parameter 입력 배열 또는 레코드
     * @example
     * / [ defineQueryParam("name").type("string") ]
     * / [ { name: "name", "type": "string" } ]
     * / { name: { type: "string" } }
     * @returns
     */
    withQueryParameters(params: QueryParamsInput): this {
        this.queryParameters = applyQueryParameters(params);
        return this;
    }

    /**
     * multipart request-parts 정의
     */
    withRequestParts(parts: (DescriptorBuilder<PartDescriptor> | PartDescriptor)[]): this {
        this.requestParts = normalizeDescriptors(parts);
        return this;
    }

    /**
     * request-fields 정의
     */
    withRequestFields(fields: (DescriptorBuilder<FieldDescriptor> | FieldDescriptor)[]): this {
        this.requestFields = normalizeDescriptors(fields);
        return this;
    }

    /**
     * responses 정의
     */
    withResponse(
        statusCode: HttpStatusCode,
        response: {
            headers?: (DescriptorBuilder<HeaderDescriptor> | HeaderDescriptor)[];
            fields?: (DescriptorBuilder<FieldDescriptor> | FieldDescriptor)[];
            description?: string;
        }
    ): this {
        const fields = response.fields ? normalizeDescriptors(response.fields) : [];
        const headers = response.headers ? normalizeDescriptors(response.headers) : [];

        this.responses[statusCode] = {
            fields,
            headers,
            description: response.description ?? "",
        };
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
     * response-fields 정의
     */
    withResponseFields(fields: (DescriptorBuilder<FieldDescriptor> | FieldDescriptor)[]): this {
        this.responseFields = normalizeDescriptors(fields);
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
