import { Response } from "supertest";
import { DocOptions } from "../types/doc-options";
import { getNRestDocsConfig } from "./config";
import { FieldBuilderOptional } from "./withField";
import { StrictChecker } from "./strict-checker";
import { isEmpty } from "es-toolkit/compat";
import { LocalDocWriter } from "./writer/local-doc-writer";
import {
    generateCurlSnippet,
    generateHttpRequestSnippet,
    generateHttpResponseSnippet,
    generatePathParametersSnippet,
    generateRequestFieldsSnippet,
    generateRequestHeadersSnippet,
    generateRequestParametersSnippet,
    generateRequestPartsSnippet,
} from "./snipperts";
import {
    FieldDescriptor,
    HeaderDescriptor,
    ParameterDescriptor,
    PartDescriptor,
} from "../types/descriptors";

export class DocRequestBuilder {
    private readonly supertestPromise: Promise<Response>;
    private options: DocOptions = {};

    private requestHeaders?: HeaderDescriptor[];
    private pathParameters?: ParameterDescriptor[];
    private requestParameters?: ParameterDescriptor[];
    private requestParts?: PartDescriptor[];
    private requestFields?: FieldDescriptor[];

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

    /** 요청 필드 정의 */
    withRequestFields(fields: FieldBuilderOptional[]): this {
        this.requestFields = this.mapFields(fields);
        return this;
    }

    /** 응답 필드 정의 */
    withResponseFields(fields: FieldBuilderOptional[]): this {
        this.responseFields = this.mapFields(fields);
        return this;
    }

    private mapFields(fields: FieldBuilderOptional[]): FieldDescriptor[] {
        return fields.map((f) => f.toDescriptor());
    }

    /**
     * supertest 요청을 실행하고, 설정된 옵션과 응답 정보를 콘솔에 출력
     */
    async doc(identifier: string): Promise<Response> {
        const response = await this.supertestPromise;
        const config = getNRestDocsConfig();

        const request = response.request as any;
        const requestBody = request?._data ?? {};
        const requestHeaders = request?.header ?? {};
        const requestMethod = request?.method ?? "";
        const requestUrl = new URL(request?.url || "", "http://localhost");

        const responseBody = response.body ?? {};
        const responseHeaders = response.headers ?? {};
        const statusCode = response.status;

        if (config.strict) {
            const checker = new StrictChecker();
            if (!isEmpty(this.requestFields)) {
                await checker.check("request", requestBody, this.requestFields);
            }
            if (!isEmpty(this.responseFields)) {
                await checker.check(
                    "response",
                    responseBody,
                    this.responseFields
                );
            }
        }

        const snippetMap: Record<string, string> = {};

        // 필수 생성 스니펫
        // curl-request
        snippetMap["curl-request"] = generateCurlSnippet(
            requestMethod,
            requestUrl,
            requestHeaders,
            requestBody
        );
        // http-request
        snippetMap["http-request"] = generateHttpRequestSnippet(
            requestMethod,
            requestUrl,
            requestHeaders,
            requestBody
        );
        // http-response
        snippetMap["http-response"] = generateHttpResponseSnippet(
            statusCode,
            responseHeaders,
            responseBody
        );

        // 선택 생성 스니펫
        // request
        if (!isEmpty(this.requestHeaders)) {
            snippetMap["request-headers"] = generateRequestHeadersSnippet(
                this.requestHeaders
            );
        }
        if (!isEmpty(this.pathParameters)) {
            snippetMap["path-parameters"] = generatePathParametersSnippet(
                this.pathParameters
            );
        }
        if (!isEmpty(this.requestParameters)) {
            snippetMap["request-parameters"] = generateRequestParametersSnippet(
                this.requestParameters
            );
        }
        if (!isEmpty(this.requestParts)) {
            snippetMap["request-parts"] = generateRequestPartsSnippet(
                this.requestParts
            );
        }
        if (!isEmpty(this.requestFields)) {
            snippetMap["request-fields"] = generateRequestFieldsSnippet(
                this.requestFields
            );
        }

        const writer = new LocalDocWriter({
            outputDir: config.output ?? "./docs",
            extension: "adoc",
            directoryStructure: "nested",
        });

        // 스니펫별로 파일 기록
        for (const [snippetName, content] of Object.entries(snippetMap)) {
            await writer.writeSnippet(identifier, snippetName, content);
        }

        return response;
    }
}

/** supertest Promise를 받아 DocRequestBuilder로 감싸기 */
export function docRequest(
    supertestPromise: Promise<Response>
): DocRequestBuilder {
    return new DocRequestBuilder(supertestPromise);
}
