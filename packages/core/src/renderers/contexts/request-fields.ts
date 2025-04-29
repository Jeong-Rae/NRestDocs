import type { DocumentSnapshot } from "@/builders";
import { inferFieldType } from "@/utils/infer-field-type";
import { isEmpty, keys, merge, some, values } from "es-toolkit/compat";

type Field = {
    path: string;
    type: string;
    format?: string;
    optional?: boolean;
    description: string;
};

export type RequestFieldsSnippetContext = {
    fields: Field[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildRequestFieldsContext(snapshot: DocumentSnapshot): RequestFieldsSnippetContext {
    const { requestBody } = snapshot.http;
    const { request } = snapshot.fields;

    if (isEmpty(requestBody) && isEmpty(request)) {
        return {
            fields: [],
            hasFormat: false,
            hasOptional: false,
        };
    }

    const bodyFields = keys(requestBody).reduce<Record<string, Field>>((acc, key) => {
        acc[key] = { path: key, type: inferFieldType(requestBody[key]), description: "" };
        return acc;
    }, {});

    const requestFields = request.reduce<Record<string, Field>>((acc, field) => {
        acc[field.name] = { ...field, path: field.name, description: field.description ?? "" };
        return acc;
    }, {});

    const mergedFields = merge(bodyFields, requestFields);

    const fields = values(mergedFields);

    const hasFormat = some(fields, (field) => Boolean(field.format));
    const hasOptional = some(fields, (field) => Boolean(field.optional));
    return {
        fields,
        hasFormat,
        hasOptional,
    };
}
