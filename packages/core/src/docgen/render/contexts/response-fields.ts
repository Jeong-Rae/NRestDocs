import { DescriptorKinds, type FieldDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { keyedArrayToRecord } from "@/types/collection";
import { inferFieldType } from "@/utils/infer-field-type";
import { isEmpty, mapValues, merge, some, values } from "es-toolkit/compat";

export type ResponseFieldsSnippetContext = {
    fields: FieldDescriptor[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildResponseFieldsContext(
    snapshot: DocumentSnapshot
): ResponseFieldsSnippetContext {
    const { responseBody } = snapshot.http;
    const { response: fieldDescriptors } = snapshot.fields;

    if (isEmpty(responseBody) && isEmpty(fieldDescriptors)) {
        return {
            fields: [],
            hasFormat: false,
            hasOptional: false,
        };
    }

    const rawFieldDescriptors = mapValues(responseBody, (value, key) => ({
        kind: DescriptorKinds.Field,
        name: key,
        type: inferFieldType(value),
        description: "",
    }));

    const descriptorFieldRecords = keyedArrayToRecord("name", fieldDescriptors);

    const mergedFieldRecords = merge(rawFieldDescriptors, descriptorFieldRecords);
    const fields = values(mergedFieldRecords);

    const hasFormat = some(fields, (field) => Boolean(field.format));
    const hasOptional = some(fields, (field) => Boolean(field.optional));

    return {
        fields,
        hasFormat,
        hasOptional,
    };
}
