import { isEmpty } from "es-toolkit/compat";

import { extractHttpRequest, extractHttpResponse } from "../extractor/http-trace-extractor";
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
} from "../snippets";

import type { DocRenderer, RenderDocumentSnippetsOptions } from "./doc-renderer.interface";
import type { Request, Response, SnippetMap, SupertestResponse } from "../../types";

export class AsciiDocRenderer implements DocRenderer {
    renderDocumentSnippets(
        response: SupertestResponse,
        options: RenderDocumentSnippetsOptions
    ): SnippetMap {
        const snippetMap: SnippetMap = {} as SnippetMap;

        const extractRequest = extractHttpRequest(response);
        const extractResponse = extractHttpResponse(response);

        this.renderRequiredSnippets(snippetMap, extractRequest, extractResponse);
        this.renderOptionalSnippets(snippetMap, options);

        return snippetMap;
    }

    private renderRequiredSnippets(
        snippetMap: SnippetMap,
        request: Request,
        response: Response
    ): void {
        snippetMap["curl-request"] = generateCurlSnippet(
            request.method,
            request.url,
            request.headers,
            request.body
        );
        snippetMap["http-request"] = generateHttpRequestSnippet(
            request.method,
            request.url,
            request.headers,
            request.body
        );
        snippetMap["http-response"] = generateHttpResponseSnippet(
            response.statusCode,
            response.headers,
            response.body
        );
    }

    private renderOptionalSnippets(
        snippetMap: SnippetMap,
        options: RenderDocumentSnippetsOptions
    ): void {
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
    }
}
