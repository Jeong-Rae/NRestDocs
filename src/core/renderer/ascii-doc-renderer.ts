import { DocRenderer, RenderDocumentSnippetsOptions } from "./doc-renderer.interface";
import { Response } from "supertest";
import { isEmpty } from "es-toolkit/compat";
import {
    generateCurlSnippet,
    generateHttpRequestSnippet,
    generateHttpResponseSnippet,
    generatePathParametersSnippet,
    generateRequestFieldsSnippet,
    generateRequestHeadersSnippet,
    generateRequestParametersSnippet,
    generateRequestPartsSnippet,
    generateResponseFieldsSnippet,
    generateResponseHeadersSnippet,
} from "../snipperts";
import { SnippetMap } from "../../types/descriptors";
import { HttpMethod } from "../../types/http";

interface RequestData {
    _data?: unknown;
    header?: Record<string, string>;
    method?: HttpMethod;
    url?: string;
}

export class AsciiDocRenderer implements DocRenderer {
    renderDocumentSnippets(response: Response, options: RenderDocumentSnippetsOptions): SnippetMap {
        const snippetMap: SnippetMap = {} as SnippetMap;

        const request = response.request as RequestData;
        const requestBody = request?._data ?? {};
        const requestHeaders = request?.header ?? {};
        const requestMethod = request?.method ?? "GET";
        const requestUrl = new URL(request?.url || "", "http://localhost");

        const responseBody = response.body ?? {};
        const responseHeaders = response.headers ?? {};
        const statusCode = response.status;

        // 필수 생성 스니펫
        snippetMap["curl-request"] = generateCurlSnippet(
            requestMethod,
            requestUrl,
            requestHeaders,
            requestBody
        );
        snippetMap["http-request"] = generateHttpRequestSnippet(
            requestMethod,
            requestUrl,
            requestHeaders,
            requestBody
        );
        snippetMap["http-response"] = generateHttpResponseSnippet(
            statusCode,
            responseHeaders,
            responseBody
        );

        // 선택 생성 스니펫
        // request
        if (!isEmpty(options.requestHeaders)) {
            snippetMap["request-headers"] = generateRequestHeadersSnippet(options.requestHeaders);
        }
        if (!isEmpty(options.pathParameters)) {
            snippetMap["path-parameters"] = generatePathParametersSnippet(options.pathParameters);
        }
        if (!isEmpty(options.requestParameters)) {
            snippetMap["request-parameters"] = generateRequestParametersSnippet(
                options.requestParameters
            );
        }
        if (!isEmpty(options.requestParts)) {
            snippetMap["request-parts"] = generateRequestPartsSnippet(options.requestParts);
        }
        if (!isEmpty(options.requestFields)) {
            snippetMap["request-fields"] = generateRequestFieldsSnippet(options.requestFields);
        }

        // response
        if (!isEmpty(options.responseHeaders)) {
            snippetMap["response-headers"] = generateResponseHeadersSnippet(
                options.responseHeaders
            );
        }
        if (!isEmpty(options.responseFields)) {
            snippetMap["response-fields"] = generateResponseFieldsSnippet(options.responseFields);
        }

        return snippetMap;
    }
}
