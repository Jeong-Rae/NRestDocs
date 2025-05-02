import type { PathParamDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty, some } from "es-toolkit/compat";
import type { Context } from "./context.type.";

export type PathParametersSnippetContext = {
    path: string;
    parameters: PathParamDescriptor[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildPathParametersContext(
    snapshot: DocumentSnapshot
): Context<PathParametersSnippetContext> {
    const { path } = snapshot.http;
    const { path: pathParameters } = snapshot.parameters;

    if (isEmpty(pathParameters)) {
        return {
            context: {
                path,
                parameters: [],
                hasFormat: false,
                hasOptional: false,
            },
            isEmpty: true,
        };
    }

    const hasFormat = some(pathParameters, (field) => Boolean(field.format));
    const hasOptional = some(pathParameters, (field) => Boolean(field.optional));

    return {
        context: {
            path,
            parameters: pathParameters,
            hasFormat,
            hasOptional,
        },
        isEmpty: false,
    };
}
