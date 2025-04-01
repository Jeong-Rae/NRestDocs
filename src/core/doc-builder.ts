import { Response } from "supertest";
import { DocOptions, FieldDescriptor } from "../types/doc-options";
import { getNRestDocsConfig } from "./config";
import { FieldBuilderOptional } from "./withField";
import { StrictChecker } from "./strict-checker";
import { isEmpty } from "es-toolkit/compat";
import { LocalDocWriter } from "./writer/local-doc-writer";
import { generateCurlSnippet } from "./snipperts/curl-snippert";
import { generateHttpRequestSnippet } from "./snipperts/http-request-snippert";
import { generateHttpResponseSnippet } from "./snipperts/http-response-snippet";

export class DocRequestBuilder {
    private readonly supertestPromise: Promise<Response>;
    private options: DocOptions = {};

    constructor(supertestPromise: Promise<Response>) {
        this.supertestPromise = supertestPromise;
    }

    /** API 설명 추가 */
    withDescription(desc: string): this {
        this.options.description = desc;
        return this;
    }

    /** 요청 필드 정의 */
    withRequestFields(fields: FieldBuilderOptional[]): this {
        this.options.requestFields = this.mapFields(fields);
        return this;
    }

    /** 응답 필드 정의 */
    withResponseFields(fields: FieldBuilderOptional[]): this {
        this.options.responseFields = this.mapFields(fields);
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

        const { requestFields, responseFields } = this.options;

        if (config.strict) {
            const checker = new StrictChecker();
            if (!isEmpty(requestFields)) {
                await checker.check("request", requestBody, requestFields);
            }
            if (!isEmpty(responseFields)) {
                await checker.check("response", responseBody, responseFields);
            }
        }

        const snippetMap: Record<string, string> = {};

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
