import { Response } from "supertest";
import { DocOptions } from "../types/doc-options";
import { getNRestDocsConfig } from "./config";
import { FieldBuilderOptional } from "./definedField";
import { StrictChecker } from "./strict-checker";
import { isEmpty } from "es-toolkit/compat";
import { LocalDocWriter } from "./writer/local-doc-writer";
import {
    FieldDescriptor,
    HeaderDescriptor,
    ParameterDescriptor,
    PartDescriptor,
} from "../types/descriptors";
import { AsciiDocRenderer } from "./renderer/ascii-doc-renderer";

interface RequestData {
    _data?: unknown;
}

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
    withRequestHeaders(headers: HeaderDescriptor[]): this {
        this.requestHeaders = headers;
        return this;
    }

    /**
     * path-parameters 정의
     */
    withPathParameters(params: ParameterDescriptor[]): this {
        this.pathParameters = params;
        return this;
    }

    /**
     * query/form request-parameters 정의
     */
    withRequestParameters(params: ParameterDescriptor[]): this {
        this.requestParameters = params;
        return this;
    }

    /**
     * multipart request-parts 정의
     */
    withRequestParts(parts: PartDescriptor[]): this {
        this.requestParts = parts;
        return this;
    }

    /**
     * request-fields 정의
     */
    withRequestFields(fields: FieldBuilderOptional[]): this {
        this.requestFields = this.mapFields(fields);
        return this;
    }

    /**
     * response-headers 정의
     */
    withResponseHeaders(headers: HeaderDescriptor[]): this {
        this.responseHeaders = headers;
        return this;
    }

    /**
     * response-fields 정의
     */
    withResponseFields(fields: FieldBuilderOptional[]): this {
        this.responseFields = this.mapFields(fields);
        return this;
    }

    private mapFields(fields: FieldBuilderOptional[]): FieldDescriptor[] {
        return fields.map((field) => field.toDescriptor());
    }

    /**
     * supertest 요청을 실행하고, 설정된 옵션과 응답 정보를 콘솔에 출력
     */
    async doc(identifier: string): Promise<Response> {
        const response = await this.supertestPromise;
        const config = getNRestDocsConfig();

        if (config.strict) {
            const checker = new StrictChecker();
            if (!isEmpty(this.requestFields)) {
                await checker.check(
                    "request",
                    (response.request as RequestData)?._data ?? {},
                    this.requestFields
                );
            }
            if (!isEmpty(this.responseFields)) {
                await checker.check("response", response.body ?? {}, this.responseFields);
            }
        }

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
