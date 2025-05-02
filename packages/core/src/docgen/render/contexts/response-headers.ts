import { DescriptorKinds, type HeaderDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { keyedArrayToRecord } from "@/types/collection";
import { isEmpty, mapValues, merge, some, values } from "es-toolkit/compat";
import type { Context } from "./context.type.";
export type ResponseHeadersSnippetContext = {
    headers: HeaderDescriptor[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildResponseHeadersContext(
    snapshot: DocumentSnapshot
): Context<ResponseHeadersSnippetContext> {
    const { responseHeaders } = snapshot.http;
    const { response: headerDescriptors } = snapshot.headers;

    if (isEmpty(responseHeaders) && isEmpty(headerDescriptors)) {
        return {
            context: {
                headers: [],
                hasFormat: false,
                hasOptional: false,
            },
            isEmpty: true,
        };
    }

    const rawHeaderFields = mapValues(responseHeaders, (_value, key) => ({
        kind: DescriptorKinds.Header,
        name: key,
        type: "string",
        description: "",
    }));

    const descriptorHeaderFields = keyedArrayToRecord("name", headerDescriptors);

    const mergedHeaderFields = merge(rawHeaderFields, descriptorHeaderFields);
    const headers = values(mergedHeaderFields);

    const hasFormat = some(headers, (field) => Boolean(field.format));
    const hasOptional = some(headers, (field) => Boolean(field.optional));

    return {
        context: {
            headers,
            hasFormat,
            hasOptional,
        },
        isEmpty: false,
    };
}
