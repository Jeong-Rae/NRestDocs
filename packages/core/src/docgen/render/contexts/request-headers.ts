import type { HeaderDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty, some } from "es-toolkit/compat";
import type { Context } from "./context.type.";

export type RequestHeadersSnippetContext = {
    headers: HeaderDescriptor[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildRequestHeadersContext(
    snapshot: DocumentSnapshot
): Context<RequestHeadersSnippetContext> {
    const { request } = snapshot.headers;

    if (isEmpty(request)) {
        return {
            context: {
                headers: [],
                hasFormat: false,
                hasOptional: false,
            },
            isEmpty: true,
        };
    }

    const hasFormat = some(request, (field) => Boolean(field.format));
    const hasOptional = some(request, (field) => Boolean(field.optional));

    return {
        context: {
            headers: request,
            hasFormat,
            hasOptional,
        },
        isEmpty: false,
    };
}
