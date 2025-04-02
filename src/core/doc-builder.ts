import { get, isFunction, map } from "es-toolkit/compat";
import { Response } from "supertest";

import {
    DocOptions,
    FieldDescriptor,
    HeaderDescriptor,
    ParameterDescriptor,
    PartDescriptor,
} from "../types";
import { BaseDescriptor } from "../types/descriptors";

import { DescriptorBuilder } from "./builders/descriptor-builder";
import { getNRestDocsConfig } from "./config";
// import { StrictChecker } from "./strict-checker";
import { AsciiDocRenderer } from "./renderer/ascii-doc-renderer";
import { LocalDocWriter } from "./writer/local-doc-writer";

// interface RequestData {
//     _data?: unknown;
// }

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
        headers: (DescriptorBuilder<HeaderDescriptor> | Omit<HeaderDescriptor, "type">)[]
    ): this {
        this.requestHeaders = this.normalizeDescriptors(headers);
        return this;
    }

    /**
     * path-parameters 정의
     */
    withPathParameters(
        params: (DescriptorBuilder<ParameterDescriptor> | ParameterDescriptor)[]
    ): this {
        this.pathParameters = this.normalizeDescriptors(params);
        return this;
    }

    /**
     * query/form request-parameters 정의
     */
    withRequestParameters(
        params: (DescriptorBuilder<ParameterDescriptor> | ParameterDescriptor)[]
    ): this {
        this.requestParameters = this.normalizeDescriptors(params);
        return this;
    }

    /**
     * multipart request-parts 정의
     */
    withRequestParts(parts: (DescriptorBuilder<PartDescriptor> | PartDescriptor)[]): this {
        this.requestParts = this.normalizeDescriptors(parts);
        return this;
    }

    /**
     * request-fields 정의
     */
    withRequestFields(fields: (DescriptorBuilder<FieldDescriptor> | FieldDescriptor)[]): this {
        this.requestFields = this.normalizeDescriptors(fields);
        return this;
    }

    /**
     * response-headers 정의
     */
    withResponseHeaders(headers: (DescriptorBuilder<HeaderDescriptor> | HeaderDescriptor)[]): this {
        this.responseHeaders = this.normalizeDescriptors(headers);
        return this;
    }

    /**
     * response-fields 정의
     */
    withResponseFields(fields: (DescriptorBuilder<FieldDescriptor> | FieldDescriptor)[]): this {
        this.responseFields = this.normalizeDescriptors(fields);
        return this;
    }

    private normalizeDescriptors<T extends BaseDescriptor>(
        descriptors: (DescriptorBuilder<T> | Partial<T>)[]
    ): T[] {
        return map(descriptors, (descriptor) => {
            if (isFunction(get(descriptor, "toDescriptor"))) {
                return (descriptor as DescriptorBuilder<T>).toDescriptor();
            }

            const raw = descriptor as Partial<T>;
            return {
                ...raw,
                type: raw.type ?? "string",
            } as T;
        });
    }

    /**
     * supertest 요청을 실행하고, 설정된 옵션과 응답 정보를 콘솔에 출력
     */
    async doc(identifier: string): Promise<Response> {
        const response = await this.supertestPromise;
        const config = getNRestDocsConfig();

        // if (config.strict) {
        //     const checker = new StrictChecker();
        //     if (!isEmpty(this.requestFields)) {
        //         await checker.check(
        //             "request",
        //             (response.request as RequestData)?._data ?? {},
        //             this.requestFields
        //         );
        //     }
        //     if (!isEmpty(this.responseFields)) {
        //         await checker.check("response", response.body ?? {}, this.responseFields);
        //     }
        // }

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

        writer.writeDocumentSnippets(identifier, snippetMap);

        return response;
    }
}

/** supertest Promise를 받아 DocRequestBuilder로 감싸기 */
export function docRequest(supertestPromise: Promise<Response>): DocRequestBuilder {
    return new DocRequestBuilder(supertestPromise);
}
