import type { HttpBody, HttpHeaders } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";

export type HttpRequestSnippetContext = {
    method: string;
    path: string;
    headers: HttpHeaders;
    body: HttpBody;
};

export function buildHttpRequestContext(snapshot: DocumentSnapshot): HttpRequestSnippetContext {
    const { method, url, requestHeaders, requestBody } = snapshot.http;

    return {
        method,
        path: url.pathname,
        headers: requestHeaders,
        body: requestBody,
    };
}
