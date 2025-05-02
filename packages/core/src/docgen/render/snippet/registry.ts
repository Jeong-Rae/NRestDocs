import type { DocumentSnapshot } from "@/docgen/builders";
import {
    type Context,
    buildCurlContext,
    buildHttpRequestContext,
    buildHttpResponseContext,
    buildPathParametersContext,
    buildQueryParametersContext,
    buildRequestBodyContext,
    buildRequestCookiesContext,
    buildRequestFieldsContext,
    buildRequestHeadersContext,
    buildResponseBodyContext,
    buildResponseCookiesContext,
    buildResponseFieldsContext,
    buildResponseHeadersContext,
} from "../contexts";
import type { TemplateStore } from "../template";
import { makeSnippetRenderer } from "./base-snippet";
import type { SnippetRenderer } from "./snippet-renderer.type";

const makeSnippetRendererFactory =
    (store: TemplateStore) =>
    <C>(
        templateName: string,
        contextBuilder: (s: DocumentSnapshot) => Context<C>
    ): SnippetRenderer =>
        makeSnippetRenderer(templateName, contextBuilder)(store);

export const snippetRegistry = (store: TemplateStore) => {
    const createRenderer = makeSnippetRendererFactory(store);

    return {
        curlRequest: createRenderer("curl-request", buildCurlContext),
        httpRequest: createRenderer("http-request", buildHttpRequestContext),
        httpResponse: createRenderer("http-response", buildHttpResponseContext),
        requestBody: createRenderer("request-body", buildRequestBodyContext),
        requestCookies: createRenderer("request-cookies", buildRequestCookiesContext),
        requestFields: createRenderer("request-fields", buildRequestFieldsContext),
        requestHeaders: createRenderer("request-headers", buildRequestHeadersContext),
        responseBody: createRenderer("response-body", buildResponseBodyContext),
        responseCookies: createRenderer("response-cookies", buildResponseCookiesContext),
        responseFields: createRenderer("response-fields", buildResponseFieldsContext),
        responseHeaders: createRenderer("response-headers", buildResponseHeadersContext),
        pathParameters: createRenderer("path-parameters", buildPathParametersContext),
        queryParameters: createRenderer("query-parameters", buildQueryParametersContext),
    } as const;
};
