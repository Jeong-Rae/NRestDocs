import { DescriptorKinds, type HeaderDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { keyedArrayToRecord } from "@/types/collection";
import { isEmpty, mapValues, merge, some, values } from "es-toolkit/compat";

export type ResponseHeadersSnippetContext = {
    headers: HeaderDescriptor[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildResponseHeadersContext(
    snapshot: DocumentSnapshot
): ResponseHeadersSnippetContext {
    const { responseHeaders } = snapshot.http;
    const { response: headerDescriptors } = snapshot.headers;

    if (isEmpty(responseHeaders) && isEmpty(headerDescriptors)) {
        return {
            headers: [],
            hasFormat: false,
            hasOptional: false,
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
        headers,
        hasFormat,
        hasOptional,
    };
}
