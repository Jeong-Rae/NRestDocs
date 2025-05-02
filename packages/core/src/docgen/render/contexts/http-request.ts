import type { HeaderDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { formatJson } from "@/utils/format";

export type HttpRequestSnippetContext = {
    method: string;
    path: string;
    headers: HeaderDescriptor[];
    body: string;
};

export function buildHttpRequestContext(snapshot: DocumentSnapshot): HttpRequestSnippetContext {
    const { method, path, requestBody } = snapshot.http;

    return {
        method,
        path,
        headers: [],
        body: `${formatJson(requestBody)}\n`,
    };
}
