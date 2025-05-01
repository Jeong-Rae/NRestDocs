import type { HeaderDescriptor, HttpBody } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";

export type HttpRequestSnippetContext = {
    method: string;
    path: string;
    headers: HeaderDescriptor[];
    body: HttpBody;
};

export function buildHttpRequestContext(snapshot: DocumentSnapshot): HttpRequestSnippetContext {
    const { method, url, requestBody } = snapshot.http;

    return {
        method,
        path: url.pathname,
        headers: [],
        body: requestBody,
    };
}
