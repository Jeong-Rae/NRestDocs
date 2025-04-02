import { getNRestDocsConfig } from "./config";
import { AsciiDocRenderer } from "./renderer/ascii-doc-renderer";
import { normalizeDescriptors } from "./utils/normalize-descriptors";
import { LocalDocWriter } from "./writer/local-doc-writer";

import type {
    DocOptions,
    FieldDescriptor,
    HeaderDescriptor,
    ParameterDescriptor,
    PartDescriptor,
} from "../types";
import type { DescriptorBuilder } from "./builders/descriptor-builder";
import type { PartialWithName } from "./utils/normalize-descriptors";
import type { Response } from "supertest";

export class DocRequestBuilder {
    private readonly supertestPromise: Promise<Response>;
    private options: DocOptions = {};

    private requestHeaders?: HeaderDescriptor[];
    private pathParameters?: ParameterDescriptor[];
    private requestParameters?: ParameterDescriptor[];
    private requestParts?: PartDescriptor[];
    private requestFields?: FieldDescriptor[];

    private responseHeaders?: HeaderDescriptor[];
    private responseFields?: FieldDescriptor[];

    constructor(supertestPromise: Promise<Response>) {
        this.supertestPromise = supertestPromise;
    }

    /** API 설명 추가 */
    withDescription(desc: string): this {
        this.options.description = desc;
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
