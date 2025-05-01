import type { HeaderDescriptor, HttpBody } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";

export type HttpResponseSnippetContext = {
    statusCode: number;
    headers: HeaderDescriptor[];
    body: HttpBody;
};

export function buildHttpResponseContext(snapshot: DocumentSnapshot): HttpResponseSnippetContext {
    const { statusCode, responseBody } = snapshot.http;

    return {
        statusCode,
        headers: [],
        body: responseBody,
    };
}
