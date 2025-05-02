import { DescriptorKinds, type FieldDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { keyedArrayToRecord } from "@/types/collection";
import { inferFieldType } from "@/utils/infer-field-type";
import { renameKey } from "@/utils/rename";
import { isEmpty, mapValues, merge, some, values } from "es-toolkit/compat";
import type { Context } from "./context.type.";

export type RequestFieldsSnippetContext = {
    fields: (Omit<FieldDescriptor, "name"> & { path: string })[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildRequestFieldsContext(
    snapshot: DocumentSnapshot
): Context<RequestFieldsSnippetContext> {
    const { requestBody } = snapshot.http;
    const { request: fieldDescriptors } = snapshot.fields;

    if (isEmpty(requestBody) && isEmpty(fieldDescriptors)) {
        return {
            context: {
                fields: [],
                hasFormat: false,
                hasOptional: false,
            },
            isEmpty: true,
        };
    }

    const rawFieldDescriptors = mapValues(requestBody, (value, key) => ({
        kind: DescriptorKinds.Field,
        name: key,
        type: inferFieldType(value),
        description: "",
    }));

    const descriptorFieldRecords = keyedArrayToRecord("name", fieldDescriptors);

    const mergedFieldRecords = merge(rawFieldDescriptors, descriptorFieldRecords);
    const fields = renameKey(values(mergedFieldRecords), {
        name: "path",
    }) as (Omit<FieldDescriptor, "name"> & { path: string })[];

    const hasFormat = some(fields, (field) => Boolean(field.format));
    const hasOptional = some(fields, (field) => Boolean(field.optional));

    return {
        context: {
            fields,
            hasFormat,
            hasOptional,
        },
        isEmpty: false,
    };
}
