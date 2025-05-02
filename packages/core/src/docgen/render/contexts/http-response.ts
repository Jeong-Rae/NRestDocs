import type { HeaderDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { formatJson } from "@/utils/format";

export type HttpResponseSnippetContext = {
    statusCode: number;
    headers: HeaderDescriptor[];
    body: string;
};

export function buildHttpResponseContext(snapshot: DocumentSnapshot): HttpResponseSnippetContext {
    const { statusCode, responseBody } = snapshot.http;

    return {
        statusCode,
        headers: [],
        body: `${formatJson(responseBody)}\n`,
    };
}
