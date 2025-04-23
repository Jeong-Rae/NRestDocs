import { getNRestDocsConfig } from "../config/config";
import { AsciiDocRenderer } from "../renderers/ascii-doc-renderer";
import { normalizeDescriptors } from "../utils/normalize-descriptors";
import { LocalDocWriter } from "../writers/local-doc-writer";

import type { Response } from "supertest";
import type {
    FieldDescriptor,
    HeaderDescriptor,
    HttpMethod,
    HttpStatusCode,
    ParameterDescriptor,
    PartDescriptor,
    ResponseDescriptor,
} from "../types";
import { extractHttpRequest } from "../utils/http-trace-extractor";
import type { PartialWithName } from "../utils/normalize-descriptors";
import type { DescriptorBuilder } from "./descriptor-builder";

export class DocRequestBuilder {
    private readonly supertestPromise: Promise<Response>;

    private requestHeaders?: HeaderDescriptor[];
    private pathParameters?: ParameterDescriptor[];
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
     * path-parameters 정의
     */
    withPathParameters(
        params: (DescriptorBuilder<ParameterDescriptor> | ParameterDescriptor)[]
    ): this {
        this.pathParameters = normalizeDescriptors(params);
        return this;
    }

    /**
     * query/form request-parameters 정의
     */
    withRequestParameters(
        params: (DescriptorBuilder<ParameterDescriptor> | ParameterDescriptor)[]
    ): this {
        this.requestParameters = normalizeDescriptors(params);
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
        const supertestResponse = await this.supertestPromise;

        const { body, headers, method, url } = extractHttpRequest(supertestResponse);

        console.log(identifier);
        console.log(body);
        console.log(headers);
        console.log(method);
        console.log(url);

        return supertestResponse;
    }
}

/** supertest Promise를 받아 DocRequestBuilder로 감싸기 */
export function docRequest(supertestPromise: Promise<Response>): DocRequestBuilder {
    return new DocRequestBuilder(supertestPromise);
}
