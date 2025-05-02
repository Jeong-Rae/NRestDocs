import type { QueryParamDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty, some } from "es-toolkit/compat";
import type { Context } from "./context.type.";

export type QueryParametersSnippetContext = {
    parameters: QueryParamDescriptor[];
    hasType: boolean;
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildQueryParametersContext(
    snapshot: DocumentSnapshot
): Context<QueryParametersSnippetContext> {
    const { query: queryParameters } = snapshot.parameters;

    if (isEmpty(queryParameters)) {
        return {
            context: {
                parameters: [],
                hasType: false,
                hasFormat: false,
                hasOptional: false,
            },
            isEmpty: true,
        };
    }

    const hasType = some(queryParameters, (field) => Boolean(field.type));
    const hasFormat = some(queryParameters, (field) => Boolean(field.format));
    const hasOptional = some(queryParameters, (field) => Boolean(field.optional));

    return {
        context: {
            parameters: queryParameters,
            hasType,
            hasFormat,
            hasOptional,
        },
        isEmpty: false,
    };
}
