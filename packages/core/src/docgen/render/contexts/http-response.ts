import type { HttpBody, HttpHeaders } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";

export type HttpResponseSnippetContext = {
    statusCode: number;
    headers: HttpHeaders;
    body: HttpBody;
};

export function buildHttpResponseContext(snapshot: DocumentSnapshot): HttpResponseSnippetContext {
    const { statusCode, responseHeaders, responseBody } = snapshot.http;

    return {
        statusCode,
        headers: responseHeaders,
        body: responseBody,
    };
}
