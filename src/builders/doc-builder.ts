import { normalizeDescriptors } from "../utils/normalize-descriptors";

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
import type { OpenAPI_V3_1 } from "../types/open-api-spec";
import { extractHttpRequest } from "../utils/http-trace-extractor";
import type { PartialWithName } from "../utils/normalize-descriptors";
import type { DescriptorBuilder } from "./descriptor-builder";
import { applyPathParameters, applyQueryParameters, renderParameters } from "./withParameters";
import {
    applyRequestFields,
    applyRequestHeaders,
    applyRequestParts,
    renderRequestBody,
} from "./withRequest";

export class DocRequestBuilder {
    private readonly supertestPromise: Promise<Response>;

    private requestHeaders?: HeaderDescriptor[];
    private pathParameters?: ParameterDescriptor[];
    private queryParameters?: ParameterDescriptor[];
    private requestParts?: PartDescriptor[];
    private requestFields?: FieldDescriptor[];

    private responseHeaders?: HeaderDescriptor[];
    private responseFields?: FieldDescriptor[];

    private responses: Record<HttpStatusCode, ResponseDescriptor> = {};

    private httpMethod?: HttpMethod;
    private httpPath?: string;

    private tags: string[] = [];
    private summary: string = "";
    private description: string = "";
    private externalDocs?: OpenAPI_V3_1.ExternalDocumentation;
    private operationId: string = "";
    private servers: string[] = [];

    constructor(supertestPromise: Promise<Response>) {
        this.supertestPromise = supertestPromise;
    }

    /** OpenAPI tags 설정 */
    withTags(tags: string[]): this {
        this.tags = tags;
        return this;
    }

    /** OpenAPI summary 설정 */
    withSummary(summary: string): this {
        this.summary = summary;
        return this;
    }

    /** OpenAPI description 설정 */
    withDescription(description: string): this {
        this.description = description;
        return this;
    }

    /** OpenAPI externalDocs 설정 */
    withExternalDocs(externalDocs: OpenAPI_V3_1.ExternalDocumentation): this {
        this.externalDocs = externalDocs;
        return this;
    }

    /**
     * path-parameters 정의
     */
    withPathParameters(
        params: (DescriptorBuilder<ParameterDescriptor> | ParameterDescriptor)[]
    ): this {
        this.pathParameters = applyPathParameters(params);
        return this;
    }

    /**
     * query request-parameters 정의
     */
    withQueryParameters(
        params: (DescriptorBuilder<ParameterDescriptor> | ParameterDescriptor)[]
    ): this {
        this.queryParameters = applyQueryParameters(params);
        return this;
    }

    // TODO: Body 쪽 content 로 정의해야함
    // /**
    //  * form request-parameters 정의
    //  */
    // withFormParameters(
    //     params: (DescriptorBuilder<ParameterDescriptor> | ParameterDescriptor)[]
    // ): this {
    //     this.requestParameters = applyRequestParameters(params);
    //     return this;
    // }

    /** request-headers 정의  */
    withRequestHeaders(
        headers: (DescriptorBuilder<HeaderDescriptor> | PartialWithName<HeaderDescriptor>)[]
    ): this {
        this.requestHeaders = applyRequestHeaders(headers);
        return this;
    }

    /** multipart request-parts 정의  */
    withRequestParts(parts: (DescriptorBuilder<PartDescriptor> | PartDescriptor)[]): this {
        this.requestParts = applyRequestParts(parts);
        return this;
    }

    /** request-fields 정의  */
    withRequestFields(fields: (DescriptorBuilder<FieldDescriptor> | FieldDescriptor)[]): this {
        this.requestFields = applyRequestFields(fields);
        return this;
    }

    /** responses 정의  */
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

    /** response-headers 정의  */
    withResponseHeaders(headers: (DescriptorBuilder<HeaderDescriptor> | HeaderDescriptor)[]): this {
        this.responseHeaders = normalizeDescriptors(headers);
        return this;
    }

    /** response-fields 정의  */
    withResponseFields(fields: (DescriptorBuilder<FieldDescriptor> | FieldDescriptor)[]): this {
        this.responseFields = normalizeDescriptors(fields);
        return this;
    }

    /** OpenAPI servers 설정 */
    withServers(servers: string[]): this {
        this.servers = servers;
        return this;
    }

    /** supertest 요청을 실행하고, 설정된 옵션과 응답 정보를 콘솔에 출력 */
    async doc(identifier: string): Promise<Response> {
        const supertestResponse = await this.supertestPromise;

        const { body, headers, method, url } = extractHttpRequest(supertestResponse);
        const mediaType = headers["content-type"] || headers["Content-Type"];
        console.log(mediaType);

        this.operationId = identifier;

        console.log(identifier);

        const pathParameters = renderParameters(this.pathParameters, "path");
        const queryParameters = renderParameters(this.queryParameters, "query");

        const requestBody = renderRequestBody(mediaType, this.requestFields, this.requestParts);

        return supertestResponse;
    }
}

/** supertest Promise를 받아 DocRequestBuilder로 감싸기 */
export function docRequest(supertestPromise: Promise<Response>): DocRequestBuilder {
    return new DocRequestBuilder(supertestPromise);
}
