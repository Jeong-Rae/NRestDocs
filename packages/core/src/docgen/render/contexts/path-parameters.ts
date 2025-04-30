import type { PathParamDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty, some } from "es-toolkit/compat";

export type PathParametersSnippetContext = {
    path: string;
    parameters: PathParamDescriptor[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildPathParametersContext(
    snapshot: DocumentSnapshot
): PathParametersSnippetContext {
    const { path } = snapshot.http;
    const { path: pathParameters } = snapshot.parameters;

    if (isEmpty(pathParameters)) {
        return {
            path,
            parameters: [],
            hasFormat: false,
            hasOptional: false,
        };
    }

    const hasFormat = some(pathParameters, (field) => Boolean(field.format));
    const hasOptional = some(pathParameters, (field) => Boolean(field.optional));

    return {
        path,
        parameters: pathParameters,
        hasFormat,
        hasOptional,
    };
}
