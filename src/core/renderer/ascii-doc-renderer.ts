import { DocRenderer, RenderParams } from "./doc-renderer.interface";
import {
    snippetOverview,
    snippetRequestBlock,
    snippetResponseBlock,
    snippetTitle,
} from "./ascii-doc-snippet";
import { DocumentSnippets } from "./doc-snipperts.type";
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
import {
    FieldDescriptor,
    HeaderDescriptor,
    ParameterDescriptor,
    PartDescriptor,
    SnippetMap,
} from "../../types/descriptors";

export class AsciiDocRenderer implements DocRenderer {
    renderSnippets(params: RenderParams): DocumentSnippets {
        const { identifier, method, path, requestBody, responseBody } = params;

        return {
            title: snippetTitle(identifier),
            overview: snippetOverview(method, path),
            request: snippetRequestBlock(requestBody),
            response: snippetResponseBlock(responseBody),
        };
    }

    /**
     * HTTP 요청/응답 정보를 기반으로 모든 스니펫을 생성
     */
    renderDocumentSnippets(
        response: Response,
        options: {
            requestHeaders?: HeaderDescriptor[];
            pathParameters?: ParameterDescriptor[];
            requestParameters?: ParameterDescriptor[];
            requestParts?: PartDescriptor[];
            requestFields?: FieldDescriptor[];
            responseHeaders?: HeaderDescriptor[];
            responseFields?: FieldDescriptor[];
        }
    ): SnippetMap {
        const snippetMap: SnippetMap = {} as SnippetMap;

        const request = response.request as any;
        const requestBody = request?._data ?? {};
        const requestHeaders = request?.header ?? {};
        const requestMethod = request?.method ?? "";
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
            snippetMap["request-headers"] = generateRequestHeadersSnippet(
                options.requestHeaders
            );
        }
        if (!isEmpty(options.pathParameters)) {
            snippetMap["path-parameters"] = generatePathParametersSnippet(
                options.pathParameters
            );
        }
        if (!isEmpty(options.requestParameters)) {
            snippetMap["request-parameters"] = generateRequestParametersSnippet(
                options.requestParameters
            );
        }
        if (!isEmpty(options.requestParts)) {
            snippetMap["request-parts"] = generateRequestPartsSnippet(
                options.requestParts
            );
        }
        if (!isEmpty(options.requestFields)) {
            snippetMap["request-fields"] = generateRequestFieldsSnippet(
                options.requestFields
            );
        }

        // response
        if (!isEmpty(options.responseHeaders)) {
            snippetMap["response-headers"] = generateResponseHeadersSnippet(
                options.responseHeaders
            );
        }
        if (!isEmpty(options.responseFields)) {
            snippetMap["response-fields"] = generateResponseFieldsSnippet(
                options.responseFields
            );
        }

        return snippetMap;
    }
}
