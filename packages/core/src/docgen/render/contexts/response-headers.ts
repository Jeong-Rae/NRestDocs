import type { HeaderDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty, some } from "es-toolkit/compat";
import type { Context } from "./context.type";

export type ResponseHeadersSnippetContext = {
    headers: HeaderDescriptor[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildResponseHeadersContext(
    snapshot: DocumentSnapshot
): Context<ResponseHeadersSnippetContext> {
    const { response } = snapshot.headers;

    if (isEmpty(response)) {
        return {
            context: {
                headers: [],
                hasFormat: false,
                hasOptional: false,
            },
            isEmpty: true,
        };
    }

    const hasFormat = some(response, (field) => Boolean(field.format));
    const hasOptional = some(response, (field) => Boolean(field.optional));

    return {
        context: {
            headers: response,
            hasFormat,
            hasOptional,
        },
        isEmpty: false,
    };
}
