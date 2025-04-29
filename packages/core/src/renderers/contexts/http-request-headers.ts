import type { DocumentSnapshot } from "@/builders";
import type { HeaderDescriptor } from "@/descriptors";
import { isEmpty } from "es-toolkit/compat";

export type HttpRequestHeadersSnippetContext = {
    headers: HeaderDescriptor[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildHttpRequestHeadersContext(
    snapshot: DocumentSnapshot
): HttpRequestHeadersSnippetContext {
    const { request } = snapshot.headers;

    if (isEmpty(request)) {
        return {
            headers: [],
            hasFormat: false,
            hasOptional: false,
        };
    }

    // const bodyKeys = new Set(keys(requestBody));
    // const filteredFields = request.filter((field) => bodyKeys.has(field.name));

    let hasFormat = false;
    let hasOptional = false;

    for (const field of request) {
        if (field.format) {
            hasFormat = true;
        }
        if (field.optional) {
            hasOptional = true;
        }
    }

    return {
        headers: request,
        hasFormat,
        hasOptional,
    };
}
