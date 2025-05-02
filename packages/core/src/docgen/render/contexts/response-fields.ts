import type { FieldDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { renameKey } from "@/utils/rename";
import { isEmpty, some, values } from "es-toolkit/compat";
import type { Context } from "./context.type.";

export type ResponseFieldsSnippetContext = {
    fields: (Omit<FieldDescriptor, "name"> & { path: string })[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildResponseFieldsContext(
    snapshot: DocumentSnapshot
): Context<ResponseFieldsSnippetContext> {
    const { response } = snapshot.fields;

    if (isEmpty(response)) {
        return {
            context: {
                fields: [],
                hasFormat: false,
                hasOptional: false,
            },
            isEmpty: true,
        };
    }

    const fields = renameKey(values(response), {
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
